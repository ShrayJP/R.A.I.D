
# 🛡️ Disaster Response System

A smart disaster detection and resource allocation platform powered by AI — built to assist government agencies like the NDMA in real-time crisis management using tweet analysis and image classification.

---

## 🚀 Features

- 🔍 **Tweet Analyzer**: Detects whether a tweet reports a real disaster using a PA Bigram + TF-IDF model.
- 🖼️ **Image Classifier**: Classifies disaster images by **type** (fire, flood, etc.) and **severity** (low/medium/high) using EfficientNet-B3.
- ⚖️ **Resource Optimizer**: Allocates appropriate emergency resources using linear optimization based on disaster characteristics.
- 🌐 **Web App Interface**: ReactJS frontend with real-time interaction and live updates from the Flask backend.
- 📍 **Location-Based Image Retrieval**: Automatically filters and analyzes images based on detected city names in tweets.

---

## 🏗️ Architecture Overview

```
+-----------------+       +------------------+       +------------------------+
|   React Frontend| <---> |   Flask Backend  | <---> |  ML Models (Tweet + Image) |
+-----------------+       +------------------+       +------------------------+
         |                          |                           |
         |                          |                           |
         |                          |                   +-------------------+
         |                          |                   |  Resource Optimizer |
         |                          |                   +-------------------+
```

---

## 🧪 Machine Learning Models

### 1. **Tweet Classifier**
- **Model**: PA Bigram Classifier with TF-IDF
- **Input**: Tweet text
- **Output**: Binary (Real Disaster: 1 / Not Disaster: 0)

### 2. **Image Classifier**
- **Model**: EfficientNet-B3 (Multi-task)
- **Outputs**:
  - Disaster Type (e.g., urban fire, tsunami)
  - Severity (low/medium/high)
  - Severity Score (for resource allocation)

### 3. **Resource Allocator**
- **Approach**: Linear optimization
- **Inputs**: Disaster type + severity
- **Outputs**: Optimal deployment of:
  - Firefighters
  - Ambulances
  - Air/Water Rescue units

---

## 💻 Setup & Run

### 📦 Frontend (React)
```bash
cd backend
npm install
npm start
```

### 🖥️ Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 📦 Backend (Flask)
```bash
cd project/src
python app.py
```

---


## 📸 Frontend Features

- 📝 Tweet input panel (up to 5 tweets)
- 🖼️ Disaster image grid with classification results
- 📊 Resource dashboard (inline editable, exportable to PDF)
- 🔔 Resource restoration alerts (bottom-right popup)

---

## 🛠️ Technologies Used

- **Frontend**: React, TailwindCSS, Lucide-react
- **Backend**: Flask, scikit-learn, PyTorch, Albumentations
- **ML Models**: EfficientNet-B3, TF-IDF + PA Bigram
- **Optimization**: SciPy, Linear Programming

---


## 📜 License

This project is open-source under the MIT License.
