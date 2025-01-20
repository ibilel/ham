from flask import Blueprint, request, jsonify
from .models import JSONRecord
from . import db
import pandas as pd
import os

main = Blueprint("main", __name__)

@main.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

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
