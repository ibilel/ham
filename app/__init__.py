import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import logging
from logging.handlers import RotatingFileHandler

# Charger les variables d'environnement depuis .env
load_dotenv()

# Initialiser SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration Flask
    CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///assistant.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialiser SQLAlchemy
    db.init_app(app)

    # Vérifier si le dossier 'logs/' existe, sinon le créer
    if not os.path.exists("logs"):
        os.makedirs("logs")

    # Configurer les logs
    log_handler = RotatingFileHandler(
        "logs/app.log", maxBytes=1000000, backupCount=5  # 1 Mo par fichier, 5 fichiers max
    )
    log_handler.setLevel("INFO")
    log_formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )
    log_handler.setFormatter(log_formatter)
    app.logger.addHandler(log_handler)

    # Gestion des erreurs HTTP 405 (méthode non autorisée)
    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed. Please check the HTTP method for this route."}), 405

    # Enregistrer les blueprints (routes)
    from .routes import main
    app.register_blueprint(main)

    return app
