from . import db
from datetime import datetime

class JSONRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.JSON, nullable=False)  # Champ pour les objets JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp

    def __repr__(self):
        return f"<JSONRecord {self.id}>"
