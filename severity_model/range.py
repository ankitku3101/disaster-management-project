# Generate human-readable disaster range documentation
range_doc = ""

ranges_summary = {
    "Floods": {
        "Low": {"rain_1h": "0–5 mm", "humidity": "60–80%", "temp": "290–300 K", "wind_speed": "0–5 m/s", "pressure": "1005–1020 hPa", "clouds": "20–50%"},
        "Moderate": {"rain_1h": "5–20 mm", "humidity": "70–90%", "temp": "285–295 K", "wind_speed": "5–10 m/s", "pressure": "995–1010 hPa", "clouds": "50–80%"},
        "High": {"rain_1h": "20–60 mm", "humidity": "85–100%", "temp": "280–290 K", "wind_speed": "10–25 m/s", "pressure": "980–1000 hPa", "clouds": "80–100%"},
    },
    "Cyclones": {
        "Low": {"rain_1h": "0–2 mm", "humidity": "60–75%", "temp": "295–305 K", "wind_speed": "10–30 m/s", "pressure": "995–1010 hPa", "clouds": "40–70%"},
        "Moderate": {"rain_1h": "2–10 mm", "humidity": "75–90%", "temp": "290–300 K", "wind_speed": "30–60 m/s", "pressure": "980–995 hPa", "clouds": "70–90%"},
        "High": {"rain_1h": "10–40 mm", "humidity": "85–100%", "temp": "285–295 K", "wind_speed": "60–120 m/s", "pressure": "950–980 hPa", "clouds": "90–100%"},
    },
    "Earthquakes": {
        "Low": {"rain_1h": "0–1 mm", "humidity": "50–70%", "temp": "280–300 K", "wind_speed": "0–2 m/s", "pressure": "1000–1025 hPa", "clouds": "0–30%"},
        "Moderate": {"rain_1h": "0–1 mm", "humidity": "60–80%", "temp": "280–295 K", "wind_speed": "2–5 m/s", "pressure": "995–1010 hPa", "clouds": "30–60%"},
        "High": {"rain_1h": "0–1 mm", "humidity": "70–90%", "temp": "275–290 K", "wind_speed": "5–10 m/s", "pressure": "980–1000 hPa", "clouds": "60–100%"},
    },
    "Forest Fires": {
        "Low": {"rain_1h": "0.5–2 mm", "humidity": "40–60%", "temp": "290–305 K", "wind_speed": "5–10 m/s", "pressure": "1000–1020 hPa", "clouds": "20–40%"},
        "Moderate": {"rain_1h": "0–0.5 mm", "humidity": "30–45%", "temp": "300–315 K", "wind_speed": "10–20 m/s", "pressure": "990–1005 hPa", "clouds": "10–30%"},
        "High": {"rain_1h": "0–0.1 mm", "humidity": "10–30%", "temp": "310–325 K", "wind_speed": "20–40 m/s", "pressure": "980–995 hPa", "clouds": "0–10%"},
    },
    "Landslides": {
        "Low": {"rain_1h": "0–5 mm", "humidity": "60–75%", "temp": "285–295 K", "wind_speed": "0–3 m/s", "pressure": "1000–1020 hPa", "clouds": "30–50%"},
        "Moderate": {"rain_1h": "5–20 mm", "humidity": "75–90%", "temp": "280–290 K", "wind_speed": "3–6 m/s", "pressure": "990–1005 hPa", "clouds": "50–80%"},
        "High": {"rain_1h": "20–50 mm", "humidity": "85–100%", "temp": "275–285 K", "wind_speed": "6–12 m/s", "pressure": "975–995 hPa", "clouds": "80–100%"},
    },
    "Heatwaves": {
        "Low": {"rain_1h": "0.5–3 mm", "humidity": "30–50%", "temp": "300–310 K", "wind_speed": "2–5 m/s", "pressure": "1000–1015 hPa", "clouds": "30–60%"},
        "Moderate": {"rain_1h": "0–0.5 mm", "humidity": "20–40%", "temp": "310–320 K", "wind_speed": "5–10 m/s", "pressure": "990–1005 hPa", "clouds": "10–30%"},
        "High": {"rain_1h": "0–0.1 mm", "humidity": "10–30%", "temp": "320–335 K", "wind_speed": "10–20 m/s", "pressure": "980–995 hPa", "clouds": "0–10%"},
    }
}

for disaster, levels in ranges_summary.items():
    range_doc += f"{disaster}:\n"
    for severity, features in levels.items():
        range_doc += f"  {severity} Severity:\n"
        for feature, val_range in features.items():
            range_doc += f"    - {feature}: {val_range}\n"
    range_doc += "\n"

# Save the summary as a text file
txt_file_path = "disaster_data_ranges.txt"
with open(txt_file_path, "w") as f:
    f.write(range_doc)

txt_file_path
