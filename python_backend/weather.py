import requests
from dotenv import load_dotenv
import os
from datetime import datetime

class Weather:
    def __init__(self, lat:float, lon:float ):
        load_dotenv()
        # OpenWeather API key
        self.API_KEY = os.getenv("OPENWEATHER_API")
        self.LAT = lat
        self.LON = lon
        self.URL = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={self.API_KEY}'
        self.response = requests.get(self.URL)


    def get_current_weather(self):
        if self.response.status_code == 200:
            data = self.response.json()
            return {
                "status_code": self.response.status_code,
                "temp": data['current']['temp'],
                "humidity": data['current']['humidity'],
                "weather": data['current']['weather'],
                "alerts": self.get_alerts(),
            }
        else:
            return {
                "status_code": self.response.status_code,
                'description': self.response.json()['message'],
            }
        

    def get_alerts(self):
        if self.response.status_code == 200:
            data = self.response.json()
            if 'alerts' in data.keys():
                return {
                    'status_code': self.response.status_code,
                    'alerts': data['alerts'],
                }
            else:
                return {
                    'status_code': 404,
                    'description': "No Current Alerts found..."
                }
        else:
            return {
                'status_code': self.response.status_code,
                'description': self.response.json()['message'],
            }

    @staticmethod
    def get_weather_history(start:str, end:str, lat:str, lon:str):    
        url = f"https://historical-forecast-api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&start_date={start}&end_date={end}&hourly=temperature_2m,rain,relative_humidity_2m&wind_speed_unit=ms&timezone=auto"
        response = requests.get(url)
        if response.status_code == 200:
            print("Past Weather History fetched")
            return response.json()         #TODO: IDK let's see if json() to be used or not for FastAPI... will try and add later maybe..!!!
        else:
            print("Past Weather Data: ",response.reason)
            return {
                'status_code': response.status_code,
                'description': response.json()
            }

if __name__ == "__main__":
    weather = Weather(26.7084, 82.4318)
    print(weather.get_current_weather())
    print(weather.get_alerts())

    date_str = "2025-04-11"
    print(Weather.get_weather_history(date_str, '2025-04-16', 26, 82))
    
    