from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pydantic
import uvicorn
import ngrok

from weather import Weather


app = FastAPI()

allowed_origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def home():
    return {
        "message": "This is home..."
    }


@app.get("/get-current-weather")
async def get_current_weather_update(lat:float, lon:float):
    weather = Weather(lat, lon)
    return weather.get_current_weather()


# @app.post("/get-alerts")
# async def get_alerts(lat:float, lon:float):
#     weather = Weather(lat, lon)


@app.get("/get-past-weather")
async def get_past_weather(start:str, lat:float, lon:float, end:str=datetime.today().strftime('%Y-%m-%d')):
    return Weather.get_weather_history(start=start, end=end, lat=lat, lon=lon)


if __name__ == "__main__":
    listener = ngrok.forward(addr=8080, domain="mole-model-drake.ngrok-free.app", authtoken_from_env = True)
    print(listener.url())
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
    ngrok.disconnect()