# MediLink – AI-Powered Drug Recommendation System for Hypertension and Diabetes

##  Overview

MediLink is an AI-powered drug recommendation system that leverages a fine-tuned deep learning model to suggest medications based on clinical data.

The system is built using a modern full-stack architecture, combining a React frontend with a FastAPI backend and a specialized medical AI model.

---

##  Model Details

* Base Model: RareMed
* Fine-tuned on: MIMIC-IV dataset (Hypertension & Diabetes subsets)
* Task: Drug recommendation based on diagnosis, medications and procedures
* Approach: Transfer learning + domain-specific fine-tuning

---

##  Features

* Symptom-based drug recommendations
* Fine-tuned medical AI model
* FastAPI backend for high-performance inference
* React-based interactive frontend
* Modular and scalable architecture

---


##  Project Structure
```
drug-recommendation/
│── backend/        # FastAPI server + model inference
│── frontend/       # React app
│── models/         # Trained model files
│── data/           # encoded Dataset 
│── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Theresenic/MediLink-AI-powered-drug-recommendation-system.git
cd MediLink-AI-powered-drug-recommendation-system
```

### 2. Backend setup

```
cd backend
python -m venv venv
venv\Scripts\activate
```

### 3. Run FastAPI server

```
uvicorn app:app --reload
```

---

### 4. Frontend setup

```
cd frontend
npm install
npm start
```

---

##  How It Works

1. User inputs data via React UI
2. Request is sent to FastAPI backend
3. Backend processes input using the fine-tuned RareMed model
4. Model predicts and returns recommended drugs
5. Results are displayed on the frontend

---

##  Dataset

* MIMIC-IV clinical dataset
* Focused on:

  * Hypertension
  * Diabetes

---





