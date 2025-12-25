# Advertising Sales Prediction AI

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20TensorFlow-blue)

A professional-grade, full-stack AI application that predicts sales figures based on advertising budgets for TV, Radio, and Newspaper. This built using a regression neural network trained with TensorFlow/Keras and deployed using industry-standard practices.

## 1. Executive Summary
This project demonstrates the end-to-end deployment of a Machine Learning model into a modern web application. It bridges the gap between data science and software engineering by serving a regression model via a robust REST API and consuming it with a responsive, user-friendly frontend. The system is designed for scalability and maintainability.

## 2. Problem Statement
Businesses need to allocate their marketing budgets efficiently to maximize sales. This Application provides an instant, data-driven tool for marketing managers to simulate different budget allocations and forecast potential revenue, thereby optimizing their advertising strategy.

## 3. Dataset Overview
The model was trained on a standard advertising dataset comprising:
- **Features (Inputs):**
  - TV Advertising Budget ($)
  - Radio Advertising Budget ($)
  - Newspaper Advertising Budget ($)
- **Target (Output):**
  - Sales Units/Revenue ($)

## 4. ML Model Details
- **Architecture:** Feed-forward Neural Network (Regression)
- **Framework:** TensorFlow / Keras (Compatible with v2.16.1+)
- **Loss Function:** Mean Squared Error (MSE) - optimized for regression accuracy.
- **Metric:** Mean Absolute Error (MAE) - used for interpretable performance tracking.
- **Input Shape:** (3,) corresponding to the three media channels.

## 5. System Architecture

```mermaid
graph TD
    Client[React Frontend] -->|JSON Request| API[FastAPI Backend]
    API -->|Load| Model[TensorFlow Model .h5]
    Model -->|Prediction| API
    API -->|JSON Response| Client
```

- **Frontend:** React + Vite (Fast, Modular, Responsive)
- **Backend:** FastAPI (High performance, Auto-validation)
- **Model:** Pre-trained Keras model (`.h5`)

## 6. API Design
**Endpoint:** `POST /predict`

**Request Body:**
```json
{
  "tv": 150.5,
  "radio": 25.0,
  "newspaper": 10.2
}
```

**Response:**
```json
{
  "predicted_sales": 14.8
}
```

## 7. Local Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+

### Step 1: Clone & Setup Backend
1. Open a terminal.
2. Navigate to `backend/`:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **IMPORTANT:** Ensure `advertising_sales_model.h5` is present in the `backend/` folder.
5. Run the server:
   ```bash
   python app.py
   ```

### Step 2: Setup Frontend
1. Open a new terminal.
2. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## 8. GitHub Upload Instructions
1. Initialize Git in the root `AdvertisingSalesAI` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AI Project"
   ```
2. Create a new repository on GitHub.
3. Link and push:
   ```bash
   git remote add origin https://github.com/<your-username>/AdvertisingSalesAI.git
   git branch -M main
   git push -u origin main
   ```

## 9. Deployment Steps

### Backend (Render.com)
1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> New -> Web Service.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.

### Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/) -> Add New -> Project.
2. Import your GitHub repository.
3. Framework Preset: **Vite**.
4. Root Directory: `frontend`.
5. Environment Variables:
   - Name: `VITE_API_URL` (Wait, for this project we hardcoded localhost for dev, but for prod you should implement env vars in `api.js` to point to your Render URL).
6. Click **Deploy**.

## 10. Future Enhancements
- [ ] Add historical data visualization.
- [ ] Implement user authentication for saving predictions.
- [ ] Containerize with Docker.

## 11. Limitations
- The model is trained on a synthetic/limited dataset and may not reflect complex real-world market dynamics perfectly.
- Strictly for educational and demonstration purposes.

---
© 2025 AI Engineering Team.
