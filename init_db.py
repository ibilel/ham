from app import create_app, db
from app.models import JSONRecord

app = create_app()

with app.app_context():
    db.create_all()  # Crée les tables dans la base de données
    print("Base de données initialisée.")
