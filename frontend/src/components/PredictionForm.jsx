import React, { useState } from 'react';
import api from '../api';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        tv: '',
        radio: '',
        newspaper: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user changes input
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        // Basic validation
        if (!formData.tv || !formData.radio || !formData.newspaper) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/predict', {
                tv: parseFloat(formData.tv),
                radio: parseFloat(formData.radio),
                newspaper: parseFloat(formData.newspaper)
            });
            setPrediction(response.data.predicted_sales);
        } catch (err) {
            console.error("Prediction error:", err);
            // More user-friendly error message
            if (err.response && err.response.status === 503) {
                setError("System initializing. Please try again in a moment.");
            } else {
                setError("Failed to connect to the prediction server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prediction-card">
            <h2>Sales Predictor</h2>
            <span className="subtitle">Enter your advertising budget allocation below.</span>

            <form onSubmit={handleSubmit} className="prediction-form">
                <div className="form-group">
                    <div className="label-row">
                        <label htmlFor="tv">TV Budget</label>
                        <span className="value-display">${formData.tv || 0}</span>
                    </div>
                    <input
                        type="range"
                        id="tv"
                        name="tv"
                        value={formData.tv || 0}
                        onChange={handleChange}
                        min="0"
                        max="500"
                        step="1"
                        className="slider"
                    />
                </div>

                <div className="form-group">
                    <div className="label-row">
                        <label htmlFor="radio">Radio Budget</label>
                        <span className="value-display">${formData.radio || 0}</span>
                    </div>
                    <input
                        type="range"
                        id="radio"
                        name="radio"
                        value={formData.radio || 0}
                        onChange={handleChange}
                        min="0"
                        max="500"
                        step="1"
                        className="slider"
                    />
                </div>

                <div className="form-group">
                    <div className="label-row">
                        <label htmlFor="newspaper">Newspaper Budget</label>
                        <span className="value-display">${formData.newspaper || 0}</span>
                    </div>
                    <input
                        type="range"
                        id="newspaper"
                        name="newspaper"
                        value={formData.newspaper || 0}
                        onChange={handleChange}
                        min="0"
                        max="500"
                        step="1"
                        className="slider"
                    />
                </div>

                <button type="submit" className="predict-btn" disabled={loading}>
                    {loading ? (
                        <span>Running Analysis...</span>
                    ) : (
                        <span>Generate Forecast</span>
                    )}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                </div>
            )}

            {prediction !== null && (
                <div className="result-container">
                    <h3>Projected Sales Revenue</h3>
                    <div className="prediction-value">
                        ${prediction.toFixed(2)}k
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
