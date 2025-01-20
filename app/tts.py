import openai

def openai_text_to_speech(text):
    response = openai.Audio.create(
        model="text-to-speech",
        input=text
    )
    audio_content = response["audio"]
    output_path = "output_audio.mp3"
    with open(output_path, "wb") as audio_file:
        audio_file.write(audio_content)
    return output_path
