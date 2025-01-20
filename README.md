# Assistant Backend Documentation

## **Description**
Ce projet constitue la partie backend d'un assistant vocal intelligent. Il gère les requêtes provenant du frontend et fournit des réponses structurées, tout en intégrant des services tiers comme l'API OpenWeatherMap. 

## **Consignes**
L'objectif était de créer un backend permettant :
- La gestion d'une base de données SQLite pour enregistrer les résultats des actions vocales et les requêtes.
- L'intégration de services tiers (comme OpenWeatherMap).
- La mise à disposition d'API REST pour communiquer avec le frontend.

## **Choix des technologies**
- **Langage principal :** Python 3.13
- **Framework backend :** Flask
- **Base de données :** SQLite
- **Gestion des dépendances :** `venv` et `pip`
- **API tierce :** OpenWeatherMap pour les informations météorologiques
- **Outils supplémentaires :**
  - `Flask-SQLAlchemy` pour la gestion de la base de données
  - `python-dotenv` pour la gestion des variables d'environnement
  - `pandas` pour l'export des données au format CSV
  - Postman pour documenter et tester les API

## **Structure mise en place**
### **Arborescence du projet**
```
assistant_backend/
├── dev/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   ├── models.py
│   ├── postman/
│   │   └── Assistant_Backend_APIs.postman_collection.json
│   ├── venv/  # Environnement virtuel
│   ├── app.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── .env
```

### **Fichiers principaux**
- **`app/__init__.py`** :
  - Configuration de l'application Flask
  - Initialisation de SQLAlchemy et des logs
  - Gestion des erreurs HTTP

- **`app/routes.py`** :
  - Définition des routes backend (API REST)

- **`app/models.py`** :
  - Définition des modèles pour la base de données SQLite

- **`init_db.py`** :
  - Script pour initialiser la base de données SQLite

- **`requirements.txt`** :
  - Liste des dépendances Python requises

- **`postman/Assistant_Backend_APIs.postman_collection.json`** :
  - Documentation Postman des API REST

### **Base de données**
#### **Structure de la base de données**
- **Table `json_records` :**
  - `id` (integer, primary key) : Identifiant unique.
  - `data` (JSON) : Contenu JSON enregistré (ex. : stt_result, user_id, timestamp).
  - `created_at` (datetime) : Date et heure de création de l'enregistrement.

#### **Fonctionnement**
- La base de données est initialisée à l'aide du fichier `init_db.py` :
  ```python
  from app import db, create_app

  app = create_app()

  with app.app_context():
      db.create_all()
      print("Base de données initialisée.")
  ```
  Exécutez ce script pour créer la table.

### **Logs**
- Les logs des requêtes et réponses sont enregistrés dans un fichier rotatif :
  - **Fichier :** `logs/app.log`
  - **Configuration :**
    - Taille maximale : 1 Mo
    - Nombre maximum de fichiers : 5
  - Exemple d'une ligne de log :
    ```
    [2025-01-20 14:00:00] INFO in routes: Requête POST /save-json traitée avec succès.
    ```

## **Principales routes backend**
### Routes implémentées
1. **`POST /save-json`** : Sauvegarde des données JSON dans la base de données
2. **`GET /get-json`** : Récupération des données JSON depuis la base
3. **`GET /export-json`** : Export des données au format JSON
4. **`GET /export-csv`** : Export des données au format CSV
5. **`POST /weather`** : Intégration avec OpenWeatherMap pour obtenir la météo d'une ville

### Scénarios de tests réalisés
#### Scénario 1 : Sauvegarde de JSON
- **Requête :**
  ```json
  {
      "stt_result": "Allume la lumière",
      "user_id": 123,
      "timestamp": "2025-01-20T14:00:00"
  }
  ```
- **Résultat attendu :**
  ```json
  {
      "message": "JSON saved successfully.",
      "id": 1
  }
  ```
- **Statut HTTP :** `201 Created`

#### Scénario 2 : Récupération des données JSON
- **Requête :** `GET /get-json`
- **Résultat attendu :**
  ```json
  [
      {
          "id": 1,
          "data": {
              "stt_result": "Allume la lumière",
              "user_id": 123,
              "timestamp": "2025-01-20T14:00:00"
          },
          "created_at": "2025-01-20T14:00:00"
      }
  ]
  ```
- **Statut HTTP :** `200 OK`

#### Scénario 3 : Export CSV
- **Requête :** `GET /export-csv`
- **Résultat attendu :**
  ```json
  {
      "message": "CSV exported successfully.",
      "path": "exports/data_export.csv"
  }
  ```
- **Statut HTTP :** `200 OK`

### Scénarios à venir
1. **Test de robustesse :**
   - Envoi de données JSON mal formatées (ex. : absence d'un champ requis).
2. **Test des limites :**
   - Envoi d'un fichier JSON très volumineux.
3. **Test des services tiers :**
   - Gestion des erreurs lorsque l'API OpenWeatherMap est indisponible.
4. **Authentification utilisateur :**
   - Ajout de tests liés à une authentification (futur).

## **Étapes d'installation et de configuration**
### **1. Clôner le projet**
```bash
git clone https://github.com/Mkheir13/48heures.git
cd 48heures/dev
```

### **2. Créer un environnement virtuel**
```bash
python -m venv venv
```

### **3. Activer l'environnement virtuel**
- **Sur Windows :**
  ```bash
  venv\Scripts\activate
  ```
- **Sur macOS/Linux :**
  ```bash
  source venv/bin/activate
  ```

### **4. Installer les dépendances**
```bash
pip install -r requirements.txt
```

### **5. Configurer les variables d'environnement**
Crée un fichier `.env` à la racine de `dev/` avec le contenu suivant :
```
WEATHER_API_KEY=2fc4723689423e69c3187b4a1c87e02a
```

### **6. Initialiser la base de données**
```bash
python init_db.py
```

### **7. Lancer le serveur Flask**
```bash
python app.py
```

### **8. Tester les routes**
- Utilise **Postman** ou **cURL** pour tester les routes documentées dans `postman/Assistant_Backend_APIs.postman_collection.json`.

## **Évolutions à venir**
1. **Gestion avancée des utilisateurs :**
   - Ajouter un système d'authentification pour identifier les utilisateurs.
2. **Intégration NLP :**
   - Transmettre les données JSON à une équipe Data Scientist pour le traitement NLP.
3. **Monitoring et performances :**
   - Mettre en place des outils pour surveiller les performances (exemple : Flask-Monitoring).
4. **Extension API :**
   - Ajouter d'autres API tiers comme Google Maps ou un service de traduction.

---
Auteurs : 
- Samy Bouadoud Dev (partie backend + readme)
- Youssouf Abayazid Dev (partie front)
- Kheir-Eddine MEDERREG Data
- Olivier Mistral Data
- Billel SOUANE Infra
