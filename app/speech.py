import openai

def openai_speech_to_text(audio_file_path):
    with open(audio_file_path, "rb") as audio_file:
        response = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file
        )
        return response.get("text", "Transcription échouée.")
