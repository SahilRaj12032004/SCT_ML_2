from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Allow all origins to access the backend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Load the saved model and scaler
kmeans = joblib.load('./kmeans_model.pkl')
scaler = joblib.load('./scaler.pkl')

@app.route('/api/predict', methods=['POST'])  # Ensure API route starts with /api
def predict():
    data = request.json  # Get JSON data
    annual_income = data.get('annual_income')
    spending_score = data.get('spending_score')

    if annual_income is None or spending_score is None:
        return jsonify({'error': 'Invalid input'}), 400

    # Preprocess input
    input_data = np.array([[annual_income, spending_score]])
    input_scaled = scaler.transform(input_data)

    # Predict cluster
    cluster = kmeans.predict(input_scaled)[0]

    return jsonify({'cluster': int(cluster)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)