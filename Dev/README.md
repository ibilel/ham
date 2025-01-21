# Assistant Vocal Intelligent - Documentation Complète

## **Description du projet**
Ce projet consiste à développer un assistant vocal intelligent déployé sur des serveurs distincts pour le frontend et le backend. Il permet aux utilisateurs d'interagir vocalement pour poser des questions ou exécuter des actions. Le système repose sur l'utilisation de diverses technologies et APIs pour interpréter les phrases et fournir des réponses adaptées.

---

## **1. Fonctionnement Général**
1. **Speech-to-Text (STT)** :
   - Réalisé dans la partie frontend.
   - Permet de convertir la voix de l'utilisateur en texte.

2. **Envoi au backend** :
   - Le frontend envoie un objet JSON contenant les données suivantes au backend via une requête POST :
     - `id` : Identifiant unique de la requête.
     - `phrase` : Phrase interprétée par le STT.
     - `timestamp` : Date et heure de la réception.

3. **Traitement Backend** :
   - Le backend utilise un système de NLP pour interpréter la phrase.
   - En fonction du contexte, il appelle les APIs pertinentes (Spotify, OpenWeatherMap) pour générer une réponse.
   - La réponse est construite sous la forme d’un objet JSON.

4. **Retour au Frontend** :
   - Le backend envoie la réponse JSON au frontend via POST.
   - Le frontend affiche la réponse et utilise un système Text-to-Speech (TTS) pour vocaliser la réponse.

---

## **2. Partie Frontend**
1. **Technologies utilisées** :
   - **React.js** :
     - Gestion de l'interface utilisateur.
     - Capture de la voix pour le STT.

2. **Rôles principaux** :
   - Convertir la voix de l'utilisateur en texte (STT).
   - Envoyer un JSON au backend contenant les données STT.
   - Recevoir la réponse JSON du backend et l’afficher.
   - Utiliser TTS pour vocaliser la réponse reçue.

3. **Requêtes vers le backend** :
   - **POST /process-json** : Envoie des données STT au backend.
   - **GET /status** : Vérifie le statut du backend.

---

## **3. Partie Backend**
1. **Technologies utilisées** :
   - **Python 3.13** : Langage principal.
   - **Flask** : Framework backend.
   - **SQLite** : Base de données pour stocker les conversations.

2. **Fonctionnalités principales** :
   - Analyse des phrases via NLP simplifié.
   - Appels aux APIs en fonction du contexte :
     - **Spotify API** : Pour jouer de la musique.
     - **OpenWeatherMap API** : Pour fournir des informations météo.
   - Gestion des logs pour tracer toutes les conversations et requêtes.
   - Export des données sous forme de CSV.

3. **Routes principales et scénarios** :

### **Route : POST /process-json**
- **Description** : Reçoit un JSON contenant la phrase et d’autres métadonnées. Analyse le contenu pour déterminer l’intention et répond en fonction.
- **Exemples de scénarios** :
  - **Scénario 1 : Demande de météo**
    - Requête :
      ```json
      {
          "phrase": "Quel temps fait-il à Paris ?",
          "timestamp": "2025-01-20T14:00:00"
      }
      ```
    - Réponse :
      ```json
      {
          "message": "Voici la météo pour Paris : 12°C avec ciel dégagé."
      }
      ```

  - **Scénario 2 : Demande de musique**
    - Requête :
      ```json
      {
          "phrase": "Joue Papaoutai de Stromae",
          "timestamp": "2025-01-20T14:00:00"
      }
      ```
    - Réponse :
      ```json
      {
          "message": "Voici un extrait audio pour Papaoutai de Stromae : https://p.scdn.co/mp3-preview/..."
      }
      ```

  - **Scénario 3 : Phrase inconnue**
    - Requête :
      ```json
      {
          "phrase": "Je veux une réponse aléatoire",
          "timestamp": "2025-01-20T14:00:00"
      }
      ```
    - Réponse :
      ```json
      {
          "message": "Je ne comprends pas votre demande."
      }
      ```

### **Route : POST /save-json**
- **Description** : Sauvegarde un objet JSON dans la base de données.
- **Exemple de scénario** :
  - Requête :
    ```json
    {
        "id": 1,
        "phrase": "Quel temps fait-il à Paris ?",
        "timestamp": "2025-01-20T14:00:00"
    }
    ```
  - Réponse :
    ```json
    {
        "message": "JSON sauvegardé avec succès.",
        "id": 1
    }
    ```

### **Route : GET /get-json**
- **Description** : Récupère tous les JSON enregistrés dans la base.
- **Exemple de réponse** :
  ```json
  [
      {
          "id": 1,
          "data": {
              "phrase": "Quel temps fait-il à Paris ?",
              "timestamp": "2025-01-20T14:00:00"
          },
          "created_at": "2025-01-20 14:01:00"
      }
  ]
  ```

### **Route : GET /export-csv**
- **Description** : Exporte les données de la base au format CSV pour analyse.
- **Exemple de réponse** :
  ```json
  {
      "message": "CSV exporté avec succès.",
      "path": "exports/data_export.csv"
  }
  ```

### **Route : GET /status**
- **Description** : Vérifie le statut du backend.
- **Exemple de réponse** :
  ```json
  {
      "status": "OK",
      "uptime": "2 hours"
  }
  ```

---

## **4. APIs Utilisées**
1. **OpenWeatherMap** :
   - Permet de récupérer les données météo pour une ville donnée.
   - Exemple de requête :
     ```json
     {
       "city": "Paris"
     }
     ```

2. **Spotify** :
   - Permet de jouer de la musique ou de gérer des playlists.
   - Exemple d’utilisation :
     - Rechercher une chanson : "Joue Papaoutai de Stromae."

---

## **5. Base de Données**
1. **Technologie** : SQLite
2. **Table principale** : `json_records`
   - **Champs** :
     - `id` : Identifiant unique de la requête.
     - `data` : Contenu JSON (phrase, contexte, etc.).
     - `created_at` : Date et heure de la création de l’enregistrement.
3. **Exemple de contenu** :
   ```json
   {
       "id": 1,
       "data": {
           "phrase": "Quel temps fait-il à Paris ?",
           "context": "weather"
       },
       "created_at": "2025-01-20T14:00:00"
   }
   ```

---

## **6. Logs**
1. **Fichier de logs** : `logs/app.log`
2. **Exemple de ligne de log** :
   ```
   [2025-01-20 14:00:00] INFO: Requête POST reçue pour /process-json.
   [2025-01-20 14:00:01] INFO: Réponse envoyée au frontend : {"message": "Voici la météo pour Paris : 12°C."}
   ```
3. **Utilité** :
   - Débogage.
   - Suivi des interactions utilisateur.

---

## **7. Export CSV**
1. **Route :** `GET /export-csv`
2. **Exemple de fichier généré** :
   ```csv
   id,data,created_at
   1,"{\"phrase\": \"Quel temps fait-il à Paris ?\"}",2025-01-20 14:00:00
   ```
3. **Utilité** :
   - Analyse des requêtes et réponses.

---

## **8. Fonctionnement détaillé des GET et POST**
1. **Requête POST (Frontend → Backend)** :
   - **URL :** `/process-json`
   - **Body :**
     ```json
     {
         "id": 1,
         "phrase": "Quel temps fait-il à Paris ?",
         "timestamp": "2025-01-20T14:00:00"
     }
     ```

2. **Requête GET (Backend → Frontend)** :
   - **URL :** `/status`
   - **Body :**
     ```json
     {
         "status": "OK",
         "uptime": "2 hours"
     }
     ```

---

## **Évolutions futures**
1. **Amélioration du NLP** :
   - Entraîner un modèle personnalisé pour mieux comprendre les requêtes utilisateur.
2. **Ajout de nouvelles APIs** :
   - Intégrer des services comme Google Maps pour des fonctionnalités supplémentaires.
3. **Optimisation des performances** :
   - Déployer un système de mise en cache pour réduire le temps de réponse.

---

## **Auteur**

Samy Boudaoud
