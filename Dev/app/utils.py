import os

def clean_temp_folder():
    """Supprime tous les fichiers dans le dossier temp."""
    for file in os.listdir("temp"):
        file_path = os.path.join("temp", file)
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Erreur lors de la suppression de {file_path}: {e}")
