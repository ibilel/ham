import spacy

# Charger un modèle pour le français
nlp = spacy.load("fr_core_news_md")  # ou fr_core_news_lg

def transformer_phrase_en_requete(phrase):
    doc = nlp(phrase.lower())


    # Extraction d'entités
    villes = [ent.text for ent in doc.ents if ent.label_ in ("LOC", "GPE")]

    requete = ''
    for ville in villes:
        requete += " " + ville.replace('-', ' ')
    return requete.strip()


# Exemple d'utilisation
phrases = [
    "Il fait quel temps sur Aix-en-Provence ?",
    "Donne-moi la météo de Lyon stp",
    "Je voudrais savoir s'il pleut à Paris"
]

for p in phrases:
    print(p, "->", transformer_phrase_en_requete(p))
