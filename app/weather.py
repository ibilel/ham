import requests
import os

# Charger la clé API météo
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric&lang=fr"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return f"À {city}, il fait {data['main']['temp']}°C avec {data['weather'][0]['description']}."
    else:
        return "Je n'ai pas pu obtenir la météo."
