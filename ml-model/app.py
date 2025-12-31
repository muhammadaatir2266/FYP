"""
Disease Prediction API
FastAPI server for the ML model that predicts diseases based on symptoms
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import numpy as np
import os
from pathlib import Path

app = FastAPI(
    title="Disease Prediction API",
    description="ML-powered disease prediction based on symptoms",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and encoders
MODEL_PATH = Path(__file__).parent / "models"
model = None
symptom_encoder = None
disease_encoder = None
symptom_list = None

# Disease information database
DISEASE_INFO = {
    "Common Cold": {
        "description": "A viral infection of the upper respiratory tract affecting the nose and throat.",
        "precautions": [
            "Rest and stay hydrated",
            "Use over-the-counter cold remedies",
            "Gargle with warm salt water",
            "Avoid close contact with others"
        ],
        "specialist": "General Physician"
    },
    "Influenza (Flu)": {
        "description": "A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and lungs.",
        "precautions": [
            "Get plenty of rest",
            "Drink lots of fluids",
            "Take antiviral medications if prescribed",
            "Stay home to prevent spreading"
        ],
        "specialist": "General Physician"
    },
    "Migraine": {
        "description": "A neurological condition characterized by intense, debilitating headaches, often accompanied by nausea and sensitivity to light.",
        "precautions": [
            "Identify and avoid triggers",
            "Rest in a dark, quiet room",
            "Apply cold compress to forehead",
            "Take prescribed medications"
        ],
        "specialist": "Neurologist"
    },
    "Hypertension": {
        "description": "A condition where the force of blood against artery walls is consistently too high.",
        "precautions": [
            "Reduce salt intake",
            "Exercise regularly",
            "Maintain healthy weight",
            "Take medications as prescribed"
        ],
        "specialist": "Cardiologist"
    },
    "Gastritis": {
        "description": "Inflammation of the stomach lining that can cause digestive issues.",
        "precautions": [
            "Avoid spicy and acidic foods",
            "Eat smaller, more frequent meals",
            "Avoid alcohol and smoking",
            "Take antacids as needed"
        ],
        "specialist": "Gastroenterologist"
    },
    "Eczema": {
        "description": "A skin condition causing itchy, inflamed, and sometimes cracked skin.",
        "precautions": [
            "Moisturize skin regularly",
            "Avoid harsh soaps and detergents",
            "Wear soft, breathable fabrics",
            "Use prescribed topical treatments"
        ],
        "specialist": "Dermatologist"
    },
    "Asthma": {
        "description": "A chronic respiratory condition affecting the airways, causing breathing difficulties.",
        "precautions": [
            "Avoid known triggers",
            "Use inhalers as prescribed",
            "Monitor peak flow readings",
            "Have an asthma action plan"
        ],
        "specialist": "Pulmonologist"
    },
    "Anxiety Disorder": {
        "description": "A mental health condition characterized by excessive worry, fear, and nervousness.",
        "precautions": [
            "Practice relaxation techniques",
            "Exercise regularly",
            "Limit caffeine and alcohol",
            "Consider therapy or counseling"
        ],
        "specialist": "Psychiatrist"
    },
    "Diabetes Type 2": {
        "description": "A metabolic disorder affecting how the body processes blood sugar (glucose).",
        "precautions": [
            "Monitor blood sugar levels",
            "Follow a balanced diet plan",
            "Exercise regularly",
            "Take medications as prescribed"
        ],
        "specialist": "Endocrinologist"
    },
    "Bronchitis": {
        "description": "Inflammation of the bronchial tubes that carry air to and from the lungs.",
        "precautions": [
            "Rest and stay hydrated",
            "Use a humidifier",
            "Avoid smoking and irritants",
            "Take prescribed medications"
        ],
        "specialist": "Pulmonologist"
    }
}

# Complete symptom list for the model
ALL_SYMPTOMS = [
    "fever", "headache", "cough", "fatigue", "nausea", "vomiting", "diarrhea",
    "chest_pain", "shortness_of_breath", "dizziness", "joint_pain", "muscle_pain",
    "sore_throat", "runny_nose", "skin_rash", "abdominal_pain", "loss_of_appetite",
    "weight_loss", "blurred_vision", "anxiety", "depression", "insomnia",
    "back_pain", "swelling", "itching", "sneezing", "congestion", "chills",
    "sweating", "palpitations", "frequent_urination", "excessive_thirst",
    "numbness", "tingling", "weakness", "confusion", "memory_loss"
]


class SymptomInput(BaseModel):
    symptoms: List[str]


class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    description: str
    precautions: List[str]
    specialist: str


class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str


def load_model():
    """Load the trained model and encoders"""
    global model, symptom_encoder, disease_encoder, symptom_list
    
    try:
        model_file = MODEL_PATH / "disease_predictor.joblib"
        if model_file.exists():
            saved_data = joblib.load(model_file)
            model = saved_data.get('model')
            symptom_encoder = saved_data.get('symptom_encoder')
            disease_encoder = saved_data.get('disease_encoder')
            symptom_list = saved_data.get('symptom_list', ALL_SYMPTOMS)
            print("✅ Model loaded successfully")
            return True
        else:
            print("⚠️ Model file not found. Using fallback prediction.")
            return False
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False


def preprocess_symptoms(symptoms: List[str]) -> np.ndarray:
    """Convert symptom list to feature vector"""
    # Normalize symptoms
    normalized = [s.lower().replace(" ", "_").replace("-", "_") for s in symptoms]
    
    # Create binary feature vector
    feature_vector = np.zeros(len(ALL_SYMPTOMS))
    for i, symptom in enumerate(ALL_SYMPTOMS):
        if symptom in normalized:
            feature_vector[i] = 1
    
    return feature_vector.reshape(1, -1)


def fallback_prediction(symptoms: List[str]) -> dict:
    """Fallback prediction when model is not available"""
    normalized = [s.lower().replace(" ", "_").replace("-", "_") for s in symptoms]
    
    # Simple rule-based prediction
    predictions = []
    
    # Common Cold rules
    cold_symptoms = {"cough", "runny_nose", "sore_throat", "sneezing", "congestion"}
    cold_match = len(set(normalized) & cold_symptoms)
    if cold_match > 0:
        predictions.append(("Common Cold", cold_match / len(cold_symptoms) * 100))
    
    # Flu rules
    flu_symptoms = {"fever", "cough", "fatigue", "muscle_pain", "headache", "chills"}
    flu_match = len(set(normalized) & flu_symptoms)
    if flu_match > 0:
        predictions.append(("Influenza (Flu)", flu_match / len(flu_symptoms) * 100))
    
    # Migraine rules
    migraine_symptoms = {"headache", "nausea", "blurred_vision", "dizziness"}
    migraine_match = len(set(normalized) & migraine_symptoms)
    if migraine_match > 0:
        predictions.append(("Migraine", migraine_match / len(migraine_symptoms) * 100))
    
    # Gastritis rules
    gastritis_symptoms = {"abdominal_pain", "nausea", "vomiting", "loss_of_appetite"}
    gastritis_match = len(set(normalized) & gastritis_symptoms)
    if gastritis_match > 0:
        predictions.append(("Gastritis", gastritis_match / len(gastritis_symptoms) * 100))
    
    # Asthma rules
    asthma_symptoms = {"shortness_of_breath", "cough", "chest_pain", "wheezing"}
    asthma_match = len(set(normalized) & asthma_symptoms)
    if asthma_match > 0:
        predictions.append(("Asthma", asthma_match / len(asthma_symptoms) * 100))
    
    # Anxiety rules
    anxiety_symptoms = {"anxiety", "palpitations", "sweating", "insomnia", "dizziness"}
    anxiety_match = len(set(normalized) & anxiety_symptoms)
    if anxiety_match > 0:
        predictions.append(("Anxiety Disorder", anxiety_match / len(anxiety_symptoms) * 100))
    
    # Diabetes rules
    diabetes_symptoms = {"frequent_urination", "excessive_thirst", "fatigue", "blurred_vision", "weight_loss"}
    diabetes_match = len(set(normalized) & diabetes_symptoms)
    if diabetes_match > 0:
        predictions.append(("Diabetes Type 2", diabetes_match / len(diabetes_symptoms) * 100))
    
    # Eczema rules
    eczema_symptoms = {"skin_rash", "itching", "swelling"}
    eczema_match = len(set(normalized) & eczema_symptoms)
    if eczema_match > 0:
        predictions.append(("Eczema", eczema_match / len(eczema_symptoms) * 100))
    
    # Bronchitis rules
    bronchitis_symptoms = {"cough", "shortness_of_breath", "chest_pain", "fatigue", "fever"}
    bronchitis_match = len(set(normalized) & bronchitis_symptoms)
    if bronchitis_match > 0:
        predictions.append(("Bronchitis", bronchitis_match / len(bronchitis_symptoms) * 100))
    
    # Sort by confidence and get top prediction
    if predictions:
        predictions.sort(key=lambda x: x[1], reverse=True)
        disease, confidence = predictions[0]
    else:
        disease = "General Health Concern"
        confidence = 50.0
    
    # Get disease info
    info = DISEASE_INFO.get(disease, {
        "description": "Please consult a healthcare professional for proper diagnosis.",
        "precautions": ["Rest well", "Stay hydrated", "Monitor symptoms", "Seek medical advice if symptoms persist"],
        "specialist": "General Physician"
    })
    
    return {
        "disease": disease,
        "confidence": min(round(confidence, 1), 95),  # Cap at 95%
        "description": info["description"],
        "precautions": info["precautions"],
        "specialist": info["specialist"]
    }


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()


@app.get("/", response_model=HealthCheckResponse)
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "using fallback",
        "available_symptoms": len(ALL_SYMPTOMS),
        "available_diseases": len(DISEASE_INFO)
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_disease(input_data: SymptomInput):
    """Predict disease based on symptoms"""
    if not input_data.symptoms:
        raise HTTPException(status_code=400, detail="At least one symptom is required")
    
    try:
        if model is not None:
            # Use trained model
            features = preprocess_symptoms(input_data.symptoms)
            prediction = model.predict(features)[0]
            probabilities = model.predict_proba(features)[0]
            confidence = float(max(probabilities) * 100)
            
            # Decode disease name
            if disease_encoder:
                disease = disease_encoder.inverse_transform([prediction])[0]
            else:
                disease = prediction
            
            # Get disease info
            info = DISEASE_INFO.get(disease, {
                "description": "Please consult a healthcare professional.",
                "precautions": ["Seek medical advice"],
                "specialist": "General Physician"
            })
            
            return {
                "disease": disease,
                "confidence": round(confidence, 1),
                "description": info["description"],
                "precautions": info["precautions"],
                "specialist": info["specialist"]
            }
        else:
            # Use fallback prediction
            return fallback_prediction(input_data.symptoms)
            
    except Exception as e:
        print(f"Prediction error: {e}")
        # Return fallback on error
        return fallback_prediction(input_data.symptoms)


@app.get("/symptoms")
async def get_symptoms():
    """Get list of all recognized symptoms"""
    return {
        "symptoms": ALL_SYMPTOMS,
        "count": len(ALL_SYMPTOMS)
    }


@app.get("/diseases")
async def get_diseases():
    """Get list of all diseases with their information"""
    return {
        "diseases": DISEASE_INFO,
        "count": len(DISEASE_INFO)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

