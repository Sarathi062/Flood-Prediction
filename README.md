# Pune Flood Prediction System

A machine learning–powered pipeline to forecast flood risk in Pune using real-time weather API data combined with dam, river, and city waterbody levels from open and government sources.



## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Data Sources](#data-sources)
- [Architecture](#architecture)
- [Setup](#setup)
- [Workflow](#workflow)
- [Directory Structure](#directory-structure)
- [Extending and Future Scope](#extending-and-future-scope)
- [License](#license)
- [Contact](#contact)



## Overview

This project automates the collection, processing, and prediction of flood risk in Pune city. It periodically fetches real-time weather and waterbody data, merges it, and feeds it into a configurable ML model to estimate flood probability and optionally trigger notifications/alerts.



## Features

- Periodic data collection from OpenWeather API and open/public water level endpoints
- Flexible ingestion: combines weather (rain, temp, humidity), dam, river, and optionally city drainage data
- ML-ready data assembly & storage (CSV or MongoDB)
- ML model training and pickling for ongoing, retrainable predictions
- Risk prediction script or API endpoint: input current conditions, receive risk score
- Alert/threshold logic for triggering notifications or logs



## Data Sources

- **Weather:** OpenWeatherMap API -- rainfall, temperature, humidity, pressure, wind
- **Dams/Rivers:** 
    - State WRD or Bhima Basin RTDAS for dam levels (Khadakwasla, Panshet, Varasgaon, Mulshi, Temghar)
    - Central Water Commission (CWC) or RTDAS for river levels (Mutha, Mula, Pavana, Bhima)
- **Static/Context (optional):**
    - PMC-published drainage and sewage infrastructure stats (annual/PDF/manual extract)
- **Historical floods:** From local news, papers, or manual event tagging



## Architecture

- **collect_data.py**: Fetch, normalize, and save current weather and water features
- **train_model.py**: Train an ML model (RandomForest, LSTM, etc.) on historical or labeled data
- **predict.py**: Run the model on new/current data for flood prediction
- **/data**: Stores rolling time-series data as CSV or DB
- **ML/ or models/**: Stores trained models (joblib/pickle/H5)

_No explicit user interface or role management is present; this is a pipeline/data+ML project._



## Setup

### Prerequisites

- Python 3.8+ (with pandas, numpy, scikit-learn, requests)
- MongoDB (for DB storage, optional; can use flat files)
- Node.js (if using REST API trigger)
- OpenWeather API key & endpoints for dam/river data

### Install & Run

```bash
git clone https://github.com/your-org/pune-flood-prediction.git
cd pune-flood-prediction
pip install -r requirements.txt
python collect_data.py         # Collect live features and save to data/
python train_model.py          # Train the model (optionally periodic)
python predict.py              # Get a prediction for next-hour flood risk
```



## Workflow

1. **Data is collected** every 30-60 min (CRON/scheduler or manual run).
2. **Features are joined**: weather, dam, river, (static capacity if available).
3. **Training data is labeled** with historical flood/no-flood events.
4. **Model is trained** regularly/retrained as new events are labeled.
5. **Predictions** are triggered on new/live data, either as scripts or via API.
6. **Alerts/logs** are written if risk exceeds configured threshold.



## Directory Structure

```
/pune-flood-prediction
├── collect_data.py
├── train_model.py
├── predict.py
├── data/
│   └── (collected CSVs, rolling DB)
├── models/
│   └── (joblib/tf_model.pkl)
├── requirements.txt
├── README.md
└── .env (sample config)
```



## Extending and Future Scope

- Add chart/dashboard view using Streamlit or Jupyter Notebook
- Plug in SMS/Telegram/email API for live warnings
- Expand to multicity or multicriteria flooding (severity/impact/loss)
- Integrate crowdsourced rainfall or IoT sensors as new data streams



## License

MIT License



## Contact

For feedback, bugs, or to contribute data connectors:  
**your-email@example.com**



Replace `your-email@example.com` and any placeholders as needed.  
This README is fully pipeline-focused—no user types/roles/UI separation, matching your project's technical scope!

[1](https://github.com/othneildrew/Best-README-Template)
[2](https://www.makeareadme.com)
[3](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/)
[4](https://gist.github.com/ramantehlan/602ad8525699486e097092e4158c5bf1)
[5](https://www.drupal.org/docs/develop/managing-a-drupalorg-theme-module-or-distribution-project/documenting-your-project/readmemd-template)
[6](https://eheidi.dev/tech-writing/20221212_documentation-101/)
[7](https://www.thegooddocsproject.dev/template/readme)
[8](https://readme.so)
[9](https://www.reddit.com/r/learnprogramming/comments/vxfku6/how_to_write_a_readme/)