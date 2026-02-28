# Precast Digital Chemist - Web Demo

This repository contains the web application demo for the CreaTech Case Competition. It consists of a FastAPI Python backend (running the AI model) and a Next.js React frontend.

## Prerequisites

- Node.js (for the frontend)
- Python 3 with `pip` (for the backend)

---

## 1. How to run the Backend (AI Model)

Open your terminal and run the following commands to start the FastAPI server:

```bash
# Navigate to the backend directory
cd backend

# (Optional but recommended) Activate the virtual environment
source /tmp/venv/bin/activate

# Install the Python dependencies
pip install -r requirements.txt

# Start the optimization backend server
uvicorn main:app --reload
```

_The backend API will run on **http://127.0.0.1:8000/optimize**._

---

## 2. How to run the Frontend (UI Dashboard)

Open a **new, completely separate terminal window**, and run the following commands:

```bash
# Navigate to the frontend directory
cd frontend

# Install the Node dependencies
npm install

# Start the Next.js development server
npm run dev
```

_The user interface will run on **http://localhost:3000**._

---

## 3. How to use the App

1. With both the backend and frontend running in separate terminal windows, open your web browser (Chrome, Safari, etc.).
2. Navigate to **http://localhost:3000**.
3. Adjust the Target Demoulding Strength slider.
4. Click **Generate AI Recipe** to trigger the backend Evolutionary AI to find the optimal concrete mix.
