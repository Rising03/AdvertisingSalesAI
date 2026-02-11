import React, { useState, useCallback } from 'react';
import api from '../api';

// Icons
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path>
    <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z"></path>
    <path d="M19 13l.5 1.5L21 15l-1.5.5L19 17l-.5-1.5L17 15l1.5-.5L19 13z"></path>
  </svg>
);

const TVIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const RadioIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
);

const NewspaperIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
    <path d="M18 14h-8"></path>
    <path d="M15 18h-5"></path>
    <path d="M10 6h8v4h-8V6Z"></path>
  </svg>
);

const PredictionForm = ({ onPredict, onBudgetChange }) => {
  const [formData, setFormData] = useState({
    tv: 100,
    radio: 50,
    newspaper: 30
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update parent component when budget changes
  const updateBudget = useCallback((data) => {
    onBudgetChange({
      tv: parseFloat(data.tv) || 0,
      radio: parseFloat(data.radio) || 0,
      newspaper: parseFloat(data.newspaper) || 0
    });
  }, [onBudgetChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (error) setError(null);
    
    // Update parent with new budget
    updateBudget({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    // Validation
    if (formData.tv < 0 || formData.radio < 0 || formData.newspaper < 0) {
      setError("Budget values cannot be negative.");
      setLoading(false);
      return;
    }

    const totalBudget = formData.tv + formData.radio + formData.newspaper;
    if (totalBudget === 0) {
      setError("Please allocate at least some budget for advertising.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/predict', {
        tv: parseFloat(formData.tv),
        radio: parseFloat(formData.radio),
        newspaper: parseFloat(formData.newspaper)
      });
      
      const predictedSales = response.data.predicted_sales;
      setPrediction(predictedSales);
      
      // Add to history
      onPredict(predictedSales, {
        tv: formData.tv,
        radio: formData.radio,
        newspaper: formData.newspaper
      });
    } catch (err) {
      console.error("Prediction error:", err);
      if (err.response?.status === 503) {
        setError("System initializing. Please try again in a moment.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Unable to connect to the server. Please check your connection.");
      } else {
        setError("Failed to generate prediction. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = formData.tv + formData.radio + formData.newspaper;

  return (
    <div className="card prediction-card">
      <div className="card-header">
        <div className="card-icon">
          <ChartIcon />
        </div>
        <div>
          <h2 className="card-title">Sales Predictor</h2>
          <p className="card-subtitle">Adjust budgets to forecast sales</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        {/* TV Budget */}
        <div className="form-group">
          <div className="label-row">
            <div className="label-with-icon">
              <div className="label-icon tv">
                <TVIcon />
              </div>
              <label htmlFor="tv">TV Advertising</label>
            </div>
            <span className="value-display">${formData.tv.toLocaleString()}</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              id="tv"
              name="tv"
              value={formData.tv}
              onChange={handleChange}
              min="0"
              max="500"
              step="5"
              className="slider"
            />
          </div>
        </div>

        {/* Radio Budget */}
        <div className="form-group">
          <div className="label-row">
            <div className="label-with-icon">
              <div className="label-icon radio">
                <RadioIcon />
              </div>
              <label htmlFor="radio">Radio Advertising</label>
            </div>
            <span className="value-display">${formData.radio.toLocaleString()}</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              id="radio"
              name="radio"
              value={formData.radio}
              onChange={handleChange}
              min="0"
              max="500"
              step="5"
              className="slider"
            />
          </div>
        </div>

        {/* Newspaper Budget */}
        <div className="form-group">
          <div className="label-row">
            <div className="label-with-icon">
              <div className="label-icon newspaper">
                <NewspaperIcon />
              </div>
              <label htmlFor="newspaper">Newspaper Advertising</label>
            </div>
            <span className="value-display">${formData.newspaper.toLocaleString()}</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              id="newspaper"
              name="newspaper"
              value={formData.newspaper}
              onChange={handleChange}
              min="0"
              max="500"
              step="5"
              className="slider"
            />
          </div>
        </div>

        {/* Total Budget Display */}
        <div className="total-budget-display">
          <span>Total Investment</span>
          <span>${totalBudget.toLocaleString()}</span>
        </div>

        {/* Submit Button */}
        <button type="submit" className="predict-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>Analyzing Data...</span>
            </>
          ) : (
            <>
              <SparklesIcon />
              <span>Generate Forecast</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
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

      {/* Result Display */}
      {prediction !== null && (
        <div className="result-container">
          <h3>Predicted Sales Revenue</h3>
          <div className="prediction-value">
            ${prediction.toFixed(2)}k
          </div>
          <p className="prediction-label">
            Based on ${totalBudget.toLocaleString()} total advertising investment
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
