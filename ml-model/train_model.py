"""
Disease Prediction Model Training Script
Train a machine learning model for disease prediction based on symptoms

Dataset: Kaggle Disease Symptom Prediction Dataset
https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# Paths
DATA_PATH = Path(__file__).parent / "data"
MODEL_PATH = Path(__file__).parent / "models"

# Create directories if they don't exist
DATA_PATH.mkdir(exist_ok=True)
MODEL_PATH.mkdir(exist_ok=True)


def load_and_preprocess_data():
    """
    Load and preprocess the disease symptom dataset
    
    Expected CSV format:
    Disease, Symptom_1, Symptom_2, ..., Symptom_17
    
    Download from Kaggle and place in data/ folder:
    - Training.csv
    - Testing.csv
    """
    
    # Check if data files exist
    training_file = DATA_PATH / "Training.csv"
    testing_file = DATA_PATH / "Testing.csv"
    
    if not training_file.exists():
        print("⚠️ Training.csv not found in data/ folder")
        print("Please download the dataset from Kaggle:")
        print("https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning")
        print("\nGenerating sample data for demonstration...")
        return generate_sample_data()
    
    # Load data
    train_df = pd.read_csv(training_file)
    test_df = pd.read_csv(testing_file) if testing_file.exists() else None
    
    print(f"✅ Loaded training data: {train_df.shape}")
    if test_df is not None:
        print(f"✅ Loaded testing data: {test_df.shape}")
    
    # Preprocess
    # Remove any whitespace from column names
    train_df.columns = train_df.columns.str.strip()
    
    # Get target and features
    target_col = 'prognosis' if 'prognosis' in train_df.columns else 'Disease'
    
    # Get all symptom columns
    symptom_cols = [col for col in train_df.columns if col != target_col]
    
    X = train_df[symptom_cols]
    y = train_df[target_col]
    
    # Handle missing values
    X = X.fillna(0)
    
    # Convert symptoms to binary (0/1)
    for col in X.columns:
        X[col] = X[col].apply(lambda x: 1 if x != 0 and pd.notna(x) else 0)
    
    return X, y, symptom_cols


def generate_sample_data():
    """Generate sample training data for demonstration"""
    
    symptoms = [
        "fever", "headache", "cough", "fatigue", "nausea", "vomiting", "diarrhea",
        "chest_pain", "shortness_of_breath", "dizziness", "joint_pain", "muscle_pain",
        "sore_throat", "runny_nose", "skin_rash", "abdominal_pain", "loss_of_appetite"
    ]
    
    diseases = {
        "Common Cold": ["cough", "runny_nose", "sore_throat", "headache", "fatigue"],
        "Influenza": ["fever", "cough", "fatigue", "muscle_pain", "headache"],
        "Migraine": ["headache", "nausea", "dizziness", "fatigue"],
        "Gastritis": ["abdominal_pain", "nausea", "vomiting", "loss_of_appetite"],
        "Bronchitis": ["cough", "shortness_of_breath", "chest_pain", "fatigue", "fever"],
        "Hypertension": ["headache", "dizziness", "chest_pain", "shortness_of_breath"],
        "Anxiety": ["dizziness", "chest_pain", "fatigue", "nausea"],
        "Eczema": ["skin_rash", "fatigue"],
        "Food Poisoning": ["nausea", "vomiting", "diarrhea", "abdominal_pain", "fever"],
        "Arthritis": ["joint_pain", "muscle_pain", "fatigue"]
    }
    
    # Generate samples
    data = []
    np.random.seed(42)
    
    for disease, disease_symptoms in diseases.items():
        # Generate 50 samples per disease
        for _ in range(50):
            row = {symptom: 0 for symptom in symptoms}
            
            # Add primary symptoms (with some variation)
            for symptom in disease_symptoms:
                if symptom in symptoms:
                    row[symptom] = 1 if np.random.random() > 0.1 else 0
            
            # Add some random noise (occasional extra symptoms)
            for symptom in symptoms:
                if row[symptom] == 0 and np.random.random() < 0.05:
                    row[symptom] = 1
            
            row['Disease'] = disease
            data.append(row)
    
    df = pd.DataFrame(data)
    
    # Save sample data
    df.to_csv(DATA_PATH / "Training.csv", index=False)
    print(f"✅ Generated sample training data: {df.shape}")
    
    X = df.drop('Disease', axis=1)
    y = df['Disease']
    
    return X, y, symptoms


def train_model(X, y, symptom_cols):
    """Train and evaluate the disease prediction model"""
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"\n📊 Training set size: {len(X_train)}")
    print(f"📊 Test set size: {len(X_test)}")
    print(f"📊 Number of diseases: {len(label_encoder.classes_)}")
    print(f"📊 Number of symptoms: {len(symptom_cols)}")
    
    # Train multiple models and compare
    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=100,
            max_depth=5,
            random_state=42
        ),
        "SVM": SVC(
            kernel='rbf',
            probability=True,
            random_state=42
        )
    }
    
    best_model = None
    best_accuracy = 0
    best_model_name = ""
    
    print("\n🔬 Training and evaluating models...")
    print("-" * 50)
    
    for name, model in models.items():
        # Train
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(model, X, y_encoded, cv=5)
        
        print(f"\n{name}:")
        print(f"  Test Accuracy: {accuracy:.4f}")
        print(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model = model
            best_model_name = name
    
    print(f"\n🏆 Best Model: {best_model_name} (Accuracy: {best_accuracy:.4f})")
    
    # Detailed evaluation of best model
    y_pred = best_model.predict(X_test)
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    # Feature importance (for tree-based models)
    if hasattr(best_model, 'feature_importances_'):
        importance = pd.DataFrame({
            'symptom': symptom_cols,
            'importance': best_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n🔍 Top 10 Most Important Symptoms:")
        print(importance.head(10).to_string(index=False))
    
    return best_model, label_encoder, symptom_cols


def save_model(model, label_encoder, symptom_cols):
    """Save the trained model and encoders"""
    
    model_data = {
        'model': model,
        'disease_encoder': label_encoder,
        'symptom_list': symptom_cols,
        'symptom_encoder': None  # Can add symptom encoder if needed
    }
    
    model_file = MODEL_PATH / "disease_predictor.joblib"
    joblib.dump(model_data, model_file)
    
    print(f"\n💾 Model saved to: {model_file}")
    
    # Also save a metadata file
    metadata = {
        'model_type': type(model).__name__,
        'num_diseases': len(label_encoder.classes_),
        'diseases': list(label_encoder.classes_),
        'num_symptoms': len(symptom_cols),
        'symptoms': symptom_cols
    }
    
    import json
    metadata_file = MODEL_PATH / "model_metadata.json"
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"📄 Metadata saved to: {metadata_file}")


def main():
    """Main training pipeline"""
    
    print("=" * 60)
    print("🏥 Disease Prediction Model Training")
    print("=" * 60)
    
    # Load data
    print("\n📁 Loading data...")
    X, y, symptom_cols = load_and_preprocess_data()
    
    # Train model
    model, label_encoder, symptom_cols = train_model(X, y, symptom_cols)
    
    # Save model
    save_model(model, label_encoder, symptom_cols)
    
    print("\n" + "=" * 60)
    print("✅ Training complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Run the API server: python app.py")
    print("2. Test prediction: curl -X POST http://localhost:8000/predict")
    print('   -H "Content-Type: application/json"')
    print('   -d \'{"symptoms": ["fever", "headache", "cough"]}\'')


if __name__ == "__main__":
    main()

