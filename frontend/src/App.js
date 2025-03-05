import { useState } from "react";
import axios from "axios";

export default function KMeansPredictor() {
  const [income, setIncome] = useState("");
  const [spendingScore, setSpendingScore] = useState("");
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/api/predict", {
        annual_income: parseFloat(income),
        spending_score: parseFloat(spendingScore),
      });
      setCluster(response.data.cluster);
    } catch (error) {
      console.error("Prediction error:", error);
      setError("Failed to connect to the prediction service. Please try again.");
      setCluster(null);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
      <div className="p-8 bg-white shadow-lg bg-opacity-20 backdrop-blur-md rounded-2xl w-80">
        <h1 className="mb-4 text-2xl font-bold text-center text-white">
          K-Means Customer Segmentation
        </h1>
        
        <div className="flex flex-col gap-3">
          <label className="font-medium text-white">Annual Income:</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="p-2 bg-white border border-white rounded-md bg-opacity-60 focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter income"
          />
          
          <label className="font-medium text-white">Spending Score:</label>
          <input
            type="number"
            value={spendingScore}
            onChange={(e) => setSpendingScore(e.target.value)}
            className="p-2 bg-white border border-white rounded-md bg-opacity-60 focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter spending score"
          />
          
          <button
            onClick={handlePredict}
            className="p-2 mt-4 text-white transition-all duration-300 ease-in-out bg-indigo-500 rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict Cluster"}
          </button>
        </div>

        {error && (
          <div className="p-2 mt-4 text-center text-white bg-red-500 rounded-lg shadow-md">
            <p>{error}</p>
          </div>
        )}

        {cluster !== null && !error && (
          <div className="p-4 mt-4 text-center bg-white shadow-md bg-opacity-80 rounded-xl">
            <h2 className="text-lg font-semibold text-indigo-700">
              Predicted Cluster: {cluster}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}