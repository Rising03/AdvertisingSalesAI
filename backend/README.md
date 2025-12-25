# Advertising Sales Prediction API

This directory contains the backend code for the Advertising Sales Prediction project, built with **FastAPI** and **TensorFlow**.

## Structure

- `app.py`: Main entry point for the API.
- `requirements.txt`: Python dependencies.
- `advertising_sales_model.h5`: The pre-trained Keras regression model (MUST BE PRESENT).

## Local Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure the model file exists:**
   Place `advertising_sales_model.h5` in this directory.

5. **Run the server:**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:8000`.

## API Endpoints

- **GET /**: Health check/Welcome message.
- **POST /predict**: Predicts sales.
    - **Body**:
      ```json
      {
        "tv": 100.0,
        "radio": 50.0,
        "newspaper": 20.0
      }
      ```
    - **Response**:
      ```json
      {
        "predicted_sales": 15.4
      }
      ```
