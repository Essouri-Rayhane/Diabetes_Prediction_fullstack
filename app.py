from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle #anuller car le modele est telecharger par joblib
import joblib

# Initialisation
app = Flask(__name__)
CORS(app)  # Autoriser les requêtes du frontend




# Charger le modèle
with open('diabetes_model.pkl', 'rb') as f:
    model = joblib.load('diabetes_model.pkl')



# Colonnes exactes attendues par le modèle
MODEL_COLUMNS = [
    'Pregnancies',
    'Glucose',
    'BloodPressure',
    'SkinThickness',
    'Insulin',
    'BMI',
    'DiabetesPedigreeFunction',
    'Age'
]

# Map pour corriger automatiquement les noms des colonnes
COLUMN_MAP = {
    'pregnancies': 'Pregnancies',
    'glucose': 'Glucose',
    'bloodpressure': 'BloodPressure',
    'bloodPressure': 'BloodPressure',
    'skinThickness': 'SkinThickness',
    'insulin': 'Insulin',
    'bmi': 'BMI',
    'diabetesPedigreeFunction': 'DiabetesPedigreeFunction',
    'peritonealFunction': 'DiabetesPedigreeFunction',
    'age': 'Age'
}


@app.route('/')
def home():
    return "Server is running!"


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Convertir en DataFrame
        df = pd.DataFrame([data])

        # Renommer automatiquement les colonnes
        df.rename(columns=lambda x: COLUMN_MAP.get(x, x), inplace=True)

        # Ajouter les colonnes manquantes avec valeur 0 (au cas où)
        for col in MODEL_COLUMNS:
            if col not in df.columns:
                df[col] = 0

        # Réordonner les colonnes pour correspondre au modèle
        df = df[MODEL_COLUMNS]

        # Faire la prédiction
        prediction = model.predict(df)
        prediction_proba = model.predict_proba(df)[0][1]

        return jsonify({
            'prediction': int(prediction[0]),
            'probability': float(prediction_proba)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
