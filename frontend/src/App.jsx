import React, { useState, useEffect } from 'react';
import PredictionForm from './components/PredictionForm';
import BudgetChart from './components/BudgetChart';
import PredictionHistory from './components/PredictionHistory';

// Icons
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('predictionHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [currentBudget, setCurrentBudget] = useState({ tv: 0, radio: 0, newspaper: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('predictionHistory', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addToHistory = (prediction, budgets) => {
    const newEntry = {
      id: Date.now(),
      prediction,
      budgets,
      date: new Date().toISOString()
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10 predictions
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('predictionHistory');
  };

  return (
    <div className="app-container">
      {/* Theme Toggle */}
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>

      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="logo-container">
            <div className="logo-icon">
              <LogoIcon />
            </div>
            <h1>AdVision AI</h1>
          </div>
        </div>
        <p className="header-desc">
          Advanced sales prediction powered by machine learning. Optimize your advertising budget allocation with data-driven insights.
        </p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <PredictionForm 
          onPredict={addToHistory}
          onBudgetChange={setCurrentBudget}
        />
        <BudgetChart budget={currentBudget} />
      </main>

      {/* History Section */}
      {history.length > 0 && (
        <PredictionHistory history={history} onClear={clearHistory} />
      )}

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} AdVision AI. Enterprise-Grade Prediction System.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
