# 🌧️ Pune Flood Prediction — Frontend (React)

A modern, responsive React-based dashboard for visualizing real-time flood prediction results, rainfall data, dam levels, alerts, risk indicators, and historical trends for Pune city.
This frontend consumes the **Flood Prediction Backend API** and renders the live risk output with a clean UI deployed on **AWS Amplify**.

---

## 🚀 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Environment Variables](#environment-variables)
* [Setup & Installation](#setup--installation)
* [Available Scripts](#available-scripts)
* [API Integration](#api-integration)
* [Build & Deployment (AWS Amplify)](#build--deployment-aws-amplify)
* [Project Structure](#project-structure)
* [Screenshots](#screenshots)
* [Future Enhancements](#future-enhancements)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## 🌐 Overview

This is the **UI layer** of the Pune Flood Prediction System.

It allows users to:

* View **live weather**, **waterbody levels**, and **risk predictions**
* Access **real-time API results** from the backend
* Visualize **graphs, warnings, probability score**
* Understand **risk zones** and **severity** through easy color-coded indicators

This frontend is fully compatible with your backend deployed at:

```
https://api.floodprediction.in
```

The site is now **hosted on AWS Amplify**, replacing the older GitHub Pages deployment.

---

## ✨ Features

* 📊 **Live flood risk indicator** with color-coded UI
* 🌧️ Real-time weather data (rain, humidity, temperature)
* 🏞️ Dam/river water level snapshot visualization
* ⚠️ Alert banners when flood risk crosses thresholds
* 📱 Fully responsive UI (Tailwind + Material UI / Custom CSS)
* 🔄 Auto-refresh capability (optional)
* 🛰️ Backend uptime/status checker
* 🚀 AWS Amplify–optimized deployment with SSR routing support
* 🔒 `.env` based secure API integration

---

## 🛠️ Tech Stack

* **React + Vite / CRA** (based on your project)
* **Tailwind CSS / MUI** (as used in your components)
* **Axios** for API calls
* **AWS Amplify** for hosting
* **React Router** for SPA navigation
* **Chart.js / Recharts** for graphs (if included)

---

## 🔗 Architecture

```
Frontend (React) → Backend API (FastAPI/Node/Python) → ML Model → Flood Prediction
```

Frontend responsibilities:

* Fetch data from `/predict`, `/weather`, `/dam-levels`, etc.
* Display values in UI components
* Inform user with alerts when risk > threshold
* Provide a clean, fast UX

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=https://api.floodprediction.in
```

For React CRA:

```
REACT_APP_API_BASE_URL=https://api.floodprediction.in
```

These variables are automatically injected during Amplify build.

---

## 📦 Setup & Installation

```bash
git clone https://github.com/your-org/floodprediction-frontend.git
cd floodprediction-frontend
npm install
```

Run locally:

```bash
npm run dev
```

---

## 📜 Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start local dev server            |
| `npm run build`   | Create production build           |
| `npm run preview` | Local preview of production build |

---

## 🔌 API Integration

Example API call:

```js
const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/predict`);
setPrediction(response.data);
```

Make sure **CORS** is allowed from Amplify domain:

```
https://main.<amplify-id>.amplifyapp.com
https://www.floodprediction.in
```

---

## ☁️ Build & Deployment (AWS Amplify)

### 1. Connect Repository

Go to AWS Amplify → Deploy → Connect GitHub → Select repo.

### 2. Add Build Settings

Amplify auto-detects React; if needed add:

```
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 3. Add Environment Variables

In Amplify → Build settings → Environment variables:

```
VITE_API_BASE_URL=https://api.floodprediction.in
```

### 4. Deploy

Amplify builds & deploys automatically.

### 5. Add Custom Domain

Attach:

```
www.floodprediction.in → Amplify frontend
api.floodprediction.in → Backend server (via NGINX/EC2)
```

---

## 📁 Project Structure

```
/floodprediction-frontend
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── README.md
└── .env
```

---

## 🖼️ Screenshots

(Add your own screenshots later)

```
[Dashboard Screenshot Here]
[Risk Indicator Here]
[Weather & Dam Levels Here]
```

---

## 🔮 Future Enhancements

* 📍 Map-based flood visualization (Leaflet / Mapbox)
* ⏱️ Historical trends & analytics
* 🛰️ Satellite rainfall overlays
* 🗺️ Ward-wise flood zone classification
* 🛜 Offline-first PWA mode
* 🔔 Push notification alerts for high-risk events
* 🎛️ Admin dashboard for data monitoring

---

## 🤝 Contributing

Contributions are welcome!
Open a pull request or raise an issue for new features or bug fixes.

---

## 📄 License

MIT License

---

## 📬 Contact

For support or collaboration:
📧 **[yashrajdhamale15@gmail.com](mailto:yashrajdhamale15@gmail.com)**
🌐 **[https://www.floodprediction.in](https://www.floodprediction.in)**

---

