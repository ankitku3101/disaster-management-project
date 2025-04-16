import joblib
import numpy as np
import pandas as pd

def predict_severity(model, label_encoder, feature_list, weather_data):
    """
    Takes processed weather data and returns predicted severity
    """
    # Create feature vector in correct order
    X = pd.DataFrame([weather_data], columns=feature_list)
    # Predict
    prediction = model.predict(X)[0]
    
    # Decode label if encoded
    if label_encoder is not None:
        prediction = label_encoder.inverse_transform([prediction])[0]
    
    return prediction

def load_model():
    model = joblib.load('severity_model/disaster_severity_model.joblib')
    le = joblib.load('severity_model/label_encoder.joblib')
    features = joblib.load('severity_model/feature_list.joblib')
    return model, le, features

def predict_live_severity(weather_data):
    """
    Predict disaster severity from live weather data
    
    Args:
        weather_data: Dictionary containing:
            - temp: Temperature in Kelvin
            - humidity: Relative humidity (%)
            - rain_1h: Rainfall in last hour (mm)
            - wind_speed: Wind speed (m/s)
            - pressure: Atmospheric pressure (hPa)
            - clouds: Cloud coverage (%)
    
    Returns:
        Predicted severity level (Low or Moderate)
    """
    model, le, features = load_model()
    
    # Make prediction
    severity = predict_severity(model, le, features, weather_data)
    return severity

# Example usage:
if __name__ == "__main__":
    # Example live weather data
    live_weather = {
        'temp': 350.0,        # Temperature in Kelvin
        'humidity': 90.0,     # Relative humidity in %
        'rain_1h': 40,       # Rainfall in mm
        'wind_speed': 50,    # Wind speed in m/s
        'pressure': 1010.0,   # Pressure in hPa
        'clouds': 95.0        # Cloud coverage in %
    }
    
    severity = predict_live_severity(live_weather)
    print(f"Predicted disaster severity: {severity}")