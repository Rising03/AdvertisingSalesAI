import React from 'react';
import PredictionForm from './components/PredictionForm';

function App() {
    return (
        <div className="app-container">
            <header>
                <h1>Advertising AI</h1>
                <p className="header-desc">Professional Sales Prediction Model</p>
            </header>

            <main>
                <PredictionForm />
            </main>

            <footer>
                <p>&copy; {new Date().getFullYear()} Advertising Sales AI. Enterprise Grade Prediction System.</p>
            </footer>
        </div>
    );
}

export default App;
