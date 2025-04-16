import pandas as pd
import numpy as np

# defining ranges for each disaster type and severity....
# values are scientifically inspired, not exact but approximate....

def generate_disaster_data(disaster_type, severity, count):
    np.random.seed(hash(disaster_type + severity) % 2**32)
    
    ranges = {
        "Floods": {
            "Low": {"rain_1h": (0, 5), "humidity": (60, 80), "temp": (290, 300), "wind_speed": (0, 5), "pressure": (1005, 1020), "clouds": (20, 50)},
            "Moderate": {"rain_1h": (5, 20), "humidity": (70, 90), "temp": (285, 295), "wind_speed": (5, 10), "pressure": (995, 1010), "clouds": (50, 80)},
            "High": {"rain_1h": (20, 60), "humidity": (85, 100), "temp": (280, 290), "wind_speed": (10, 25), "pressure": (980, 1000), "clouds": (80, 100)},
        },
        "Cyclones": {
            "Low": {"rain_1h": (0, 2), "humidity": (60, 75), "temp": (295, 305), "wind_speed": (10, 25), "pressure": (995, 1010), "clouds": (40, 70)},
            "Moderate": {"rain_1h": (2, 10), "humidity": (75, 90), "temp": (290, 300), "wind_speed": (25, 45), "pressure": (980, 995), "clouds": (70, 90)},
            "High": {"rain_1h": (10, 40), "humidity": (85, 100), "temp": (285, 295), "wind_speed": (45, 65), "pressure": (950, 980), "clouds": (90, 100)},
        },
        "Earthquakes": {
            "Low": {"rain_1h": (0, 1), "humidity": (50, 70), "temp": (280, 300), "wind_speed": (0, 2), "pressure": (1000, 1025), "clouds": (0, 30)},
            "Moderate": {"rain_1h": (0, 1), "humidity": (60, 80), "temp": (280, 295), "wind_speed": (2, 5), "pressure": (995, 1010), "clouds": (30, 60)},
            "High": {"rain_1h": (0, 1), "humidity": (70, 90), "temp": (275, 290), "wind_speed": (5, 10), "pressure": (980, 1000), "clouds": (60, 100)},
        },
        "Forest Fires": {
            "Low": {"rain_1h": (0.5, 2), "humidity": (40, 60), "temp": (290, 305), "wind_speed": (5, 10), "pressure": (1000, 1020), "clouds": (20, 40)},
            "Moderate": {"rain_1h": (0, 0.5), "humidity": (30, 45), "temp": (300, 315), "wind_speed": (10, 20), "pressure": (990, 1005), "clouds": (10, 30)},
            "High": {"rain_1h": (0, 0.1), "humidity": (10, 30), "temp": (310, 325), "wind_speed": (20, 40), "pressure": (980, 995), "clouds": (0, 10)},
        },
        "Landslides": {
            "Low": {"rain_1h": (0, 5), "humidity": (60, 75), "temp": (285, 295), "wind_speed": (0, 3), "pressure": (1000, 1020), "clouds": (30, 50)},
            "Moderate": {"rain_1h": (5, 20), "humidity": (75, 90), "temp": (280, 290), "wind_speed": (3, 6), "pressure": (990, 1005), "clouds": (50, 80)},
            "High": {"rain_1h": (20, 50), "humidity": (85, 100), "temp": (275, 285), "wind_speed": (6, 12), "pressure": (975, 995), "clouds": (80, 100)},
        },
        "Heatwaves": {
            "Low": {"rain_1h": (0.5, 3), "humidity": (30, 50), "temp": (300, 310), "wind_speed": (2, 5), "pressure": (1000, 1015), "clouds": (30, 60)},
            "Moderate": {"rain_1h": (0, 0.5), "humidity": (20, 40), "temp": (310, 320), "wind_speed": (5, 10), "pressure": (990, 1005), "clouds": (10, 30)},
            "High": {"rain_1h": (0, 0.1), "humidity": (10, 30), "temp": (320, 335), "wind_speed": (10, 20), "pressure": (980, 995), "clouds": (0, 10)},
        },
    }

    r = ranges[disaster_type][severity]

    data = {
        "disaster_type": [disaster_type] * count,
        "severity": [severity] * count,
        "temp": np.random.uniform(*r["temp"], count),
        "humidity": np.random.uniform(*r["humidity"], count),
        "rain_1h": np.random.uniform(*r["rain_1h"], count),
        "wind_speed": np.random.uniform(*r["wind_speed"], count),
        "pressure": np.random.uniform(*r["pressure"], count),
        "clouds": np.random.uniform(*r["clouds"], count),
    }

    return pd.DataFrame(data)

# generating 100 samples per severity level per disaster type...
disaster_types = ["Floods", "Cyclones", "Earthquakes", "Forest Fires", "Landslides", "Heatwaves"]
severities = ["Low", "Moderate", "High"]

all_data = pd.concat([
    generate_disaster_data(disaster, severity, 100)
    for disaster in disaster_types
    for severity in severities
], ignore_index=True)

print(all_data.sample(5))

# Save the generated dataset to a CSV file
file_path = "dataset\model_training_dataset.csv"
all_data.to_csv(file_path, index=False)

file_path

