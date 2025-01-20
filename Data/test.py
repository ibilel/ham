from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
import numpy as np
import torch
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report
import os
import spacy

# Charger le modèle SpaCy pour le français
nlp = spacy.load("fr_core_news_md")

# 1. Préparer les données
# Données annotées (phrases et leurs intentions)
data = {
    "text": [
        "Il fait quel temps sur Aix-en-Provence ?",
        "Quelle est la météo à Paris ?",
        "Donne-moi la météo pour demain.",
        "Est-ce qu'il pleut à Lyon ?",
        "Prévisions météo pour Marseille.",
        "Quel temps fera-t-il à Toulouse ?",
        "La météo pour demain, s'il te plaît.",
        "Lance une musique relaxante.",
        "Joue-moi une chanson motivante.",
        "Mets une playlist classique.",
        "Peux-tu jouer du rock ?",
        "Joue Validé de Booba.",
        "Lance de la musique, s'il te plaît.",
    ],
    "label": [
        0, 0, 0, 0, 0, 0, 0,  # Météo
        1, 1, 1, 1, 1, 1,  # Musique
    ]
}

# Diviser les données en jeu d'entraînement et d'évaluation
train_texts, eval_texts, train_labels, eval_labels = train_test_split(
    data["text"], data["label"], test_size=0.2, random_state=42
)

# Créer des datasets Hugging Face
train_dataset = Dataset.from_dict({"text": train_texts, "label": train_labels})
eval_dataset = Dataset.from_dict({"text": eval_texts, "label": eval_labels})

# 2. Charger un tokenizer et un modèle pré-entraîné
model_name = "camembert-base"  # Modèle spécifique au français
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Tokeniser les données
def preprocess(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True)

encoded_train_dataset = train_dataset.map(preprocess, batched=True)
encoded_eval_dataset = eval_dataset.map(preprocess, batched=True)

# 3. Charger ou entraîner le modèle pré-entraîné
num_labels = 2  # Deux classes : "Demande de météo" et "Demande de musique"
model_path = "./saved_model"
if os.path.exists(model_path):
    print("Chargement du modèle entraîné depuis le disque...")
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
else:
    print("Entraînement d'un nouveau modèle...")
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)

    # 4. Configurer les arguments d'entraînement
    training_args = TrainingArguments(
        output_dir="./results",
        evaluation_strategy="epoch",
        learning_rate=5e-5,
        per_device_train_batch_size=4,  # Réduction pour s'adapter au petit dataset
        num_train_epochs=10,  # Plus d'époques pour un meilleur apprentissage
        weight_decay=0.01,
        logging_dir="./logs",
        logging_steps=10,
        save_strategy="epoch",
        load_best_model_at_end=True,  # Charger le meilleur modèle
    )

    # 5. Définir une fonction de métriques
    def compute_metrics(p):
        preds = np.argmax(p.predictions, axis=1)
        labels = p.label_ids
        precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
        acc = accuracy_score(labels, preds)
        return {"accuracy": acc, "f1": f1, "precision": precision, "recall": recall}

    # 6. Créer un Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=encoded_train_dataset,
        eval_dataset=encoded_eval_dataset,
        tokenizer=tokenizer,
        compute_metrics=compute_metrics,
    )

    # 7. Entraîner le modèle
    trainer.train()

    # Sauvegarder le modèle entraîné
    model.save_pretrained(model_path)
    tokenizer.save_pretrained(model_path)

# 8. Fonction de prédiction avec détection de ville

def extract_city_spacy(text):
    doc = nlp(text.lower())
    cities = [ent.text for ent in doc.ents if ent.label_ in ("LOC", "GPE")]
    return cities[0] if cities else None

def predict_with_threshold_and_city(texts, threshold=0.6):
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    predictions = torch.argmax(probs, dim=-1)
    max_probs = probs.max(dim=-1).values

    labels = ["Demande de météo", "Demande de musique"]
    results = []
    for i, text in enumerate(texts):
        city = extract_city_spacy(text)
        if max_probs[i] < threshold:
            results.append({"intention": "Intention ambiguë", "ville": city})
        else:
            results.append({"intention": labels[predictions[i]], "ville": city})
    return results

# Exemple de test
test_texts = [
    "Donne-moi la météo pour demain à Lyon.",
    "Joue de la musique classique.",
    "Quel temps fait-il à Pariiisss aujourd'hui ?",
    "Mets Validé par Booba.",
    "Je voudrais savoir s'il pleut à Paris.",
    "il fait beau a Blida",
    "Kuala lumpur est une belle ville ?",
]
results = predict_with_threshold_and_city(test_texts)

for text, result in zip(test_texts, results):
    print(f"Phrase : {text}")
    print(f"Prédiction : {result['intention']}, Ville détectée : {result['ville']}")

# 9. Évaluer le modèle
def evaluate_model():
    inputs = tokenizer(eval_texts, padding=True, truncation=True, return_tensors="pt")
    outputs = model(**inputs)
    preds = torch.argmax(outputs.logits, axis=1).numpy()
    print(classification_report(eval_labels, preds, target_names=["Demande de météo", "Demande de musique"]))

evaluate_model()
