from flask import Blueprint, request, jsonify
from .models import JSONRecord
from . import db
import pandas as pd
import os
import spacy
import re
from datetime import datetime, timedelta


# Charger le modèle spaCy pour le français
nlp = spacy.load("fr_core_news_sm")

main = Blueprint("main", __name__)

# Route pour afficher un message simple
@main.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

# Route pour traiter les commandes utilisateur (météo ou musique)
@main.route("/getCommande", methods=["POST"])
def get_commande():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 415

        data = request.get_json()
        command = data.get('command', '')

        if not command:
            return jsonify({"error": "Aucune commande fournie."}), 400

        result = analyze_command(command)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def analyze_command(command: str):
    """
    Analyse la commande de l'utilisateur pour détecter l'intention (météo ou musique)
    et extraire les informations nécessaires (lieu, musique, date).
    """
    commande_lower = command.lower()
    doc = nlp(command.lower())
    if "météo" in commande_lower or "temps" in commande_lower:
        location = extract_location(doc)
        date = extract_date(commande_lower)
        if location:
            return {"intent": "weather", "location": location, "date": date}
        else:
            return {"intent": "unknown", "message": "Localisation non trouvée."}
    
    elif "musique" in commande_lower or "joue" in commande_lower or "jouer" in commande_lower or "chanson" in commande_lower or "chansons" in commande_lower or "lance" in commande_lower:
        music_query = extract_music_query(commande_lower)
        print("musique :", commande_lower)
        if music_query:
            return {"intent": "music", "query": music_query}
        else:
            return {"intent": "unknown", "message": "Aucune musique spécifiée."}

    else:
        return {"intent": "unknown", "message": "Commande non reconnue."}

def extract_location(doc):
    """
    Extrait la localisation (ville) de la commande en recherchant des entités géographiques.
    """
    locations = ["paris", "londres", "new york", "tokyo", "barcelone", "madrid", "los angeles", "berlin"]
    for loc in locations:
        if loc in doc.text:
            return loc.capitalize()
    return None

def extract_date(command):
    """
    Extrait la date (par exemple "demain") de la commande.
    """
    if "demain" in command:
        return (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    return datetime.now().strftime("%Y-%m-%d")

def extract_music_query(command):
    """
    Extrait la requête musicale (par exemple, l'artiste ou le titre de la chanson).
    """
    match = re.search(r"(joue|met|lance)\s*(.*)", command)
    if match:
        return match.group(2).strip()
    return None

# Route pour sauvegarder les objets JSON
@main.route("/save-json", methods=["POST"])
def save_json():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 415

        data = request.get_json()
        new_record = JSONRecord(data=data)
        db.session.add(new_record)
        db.session.commit()

        # Log de la sauvegarde
        print(f"JSON sauvegardé avec l'ID {new_record.id}: {data}")
        return jsonify({"message": "JSON saved successfully.", "id": new_record.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route pour exporter les données au format JSON
@main.route("/export-json", methods=["GET"])
def export_json():
    try:
        records = JSONRecord.query.all()
        result = [
            {
                "id": record.id,
                "data": record.data,
                "created_at": record.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for record in records
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route pour exporter les données au format CSV
@main.route("/export-csv", methods=["GET"])
def export_csv():
    try:
        records = JSONRecord.query.all()
        data = [
            {
                "id": record.id,
                "data": record.data,
                "created_at": record.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for record in records
        ]
        # Sauvegarder en CSV
        df = pd.DataFrame(data)
        if not os.path.exists("exports"):
            os.makedirs("exports")
        csv_path = "exports/data_export.csv"
        df.to_csv(csv_path, index=False)

        return jsonify({"message": "CSV exported successfully.", "path": csv_path}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
