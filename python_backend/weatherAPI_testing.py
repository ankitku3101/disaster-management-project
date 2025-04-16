import requests
from dotenv import load_dotenv
import os

load_dotenv()

# OpenWeather API key
API_KEY = os.getenv("OPENWEATHER_API")

# Coordinates for the location For testing only...
LAT = 40.7128
LON = -74.0060

# Base URL for One Call 3.0
url = f"https://api.openweathermap.org/data/3.0/onecall?lat={LAT}&lon={LON}&appid={API_KEY}"

def get_current_temperature():
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        current_temp = data['current']['temp']
        print(f"Current Temperature: {current_temp}°C")
    else:
        print(f"Error fetching data: {response.status_code}, {response.text}")

if __name__ == "__main__":
    get_current_temperature()
