# 🐄 SmartLivestock — AI-Powered Cattle Breed Identification & Health Intelligence

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646C9F.svg?logo=vite&logoColor=white)](https://vitejs.dev)

---

## 📸 Overview

![SmartLivestock Banner](docs/screenshot.png)

**SmartLivestock** is an end-to-end AI platform for instant cattle and bovine breed identification, health assessment, and agricultural livestock management. Built with a custom **PyTorch ResNet-18** deep convolutional neural network, it can accurately identify **41 distinct Indian bovine breeds** from an image with high precision, providing real-time top-3 prediction probabilities, breed origins, physical traits, milk yield expectations, care guidance, and disease risk profiles.

---

## ✨ Key Features

- 🧬 **41 Bovine Breeds Supported**: Trained on comprehensive datasets covering indigenous cattle and buffalo breeds across India (Sahiwal, Gir, Red Sindhi, Murrah, Jaffarabadi, Nagpuri, Hariana, and more).
- ⚡ **High Precision PyTorch Inference**: Optimized ResNet18 backbone with custom multi-layer classification head delivering near real-time predictions.
- 📊 **Top-3 Confidence Breakdown**: Multi-class softmax distribution showing top candidate breeds and percentage confidence.
- 🩺 **Agricultural & Health Insights**: Enriched breed data including species classification (*Bos indicus*, *Bos taurus*, *Bubalus bubalis*), typical origin, milk yield estimates, weight ranges, veterinary notes, and disease risk mitigation.
- 🎨 **Modern Glassmorphic UI**: Built with React 18, Vite, Tailwind CSS, and Framer Motion animations with interactive camera and drag-and-drop file upload.
- 🚀 **Dual Deployment Ready**: Run as independent microservices (Vite Dev Server + FastAPI) or as a unified full-stack server where FastAPI serves the compiled React SPA directly at root /.

---

## 🏗 System Architecture

`
Breed/
├── best_cattle_breed_model.pth    # Trained PyTorch model weights (ResNet-18)
├── final_cattle_breed_model.pth   # Final training checkpoint
├── class_names.json               # 41 target bovine breed classes
├── docs/                          # Screenshots & documentation assets
│   └── screenshot.png
├── project/
│   ├── index.html                 # Web entry point
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vite.config.ts             # Vite build configuration
│   ├── .env.example               # Example environment variables
│   ├── src/                       # React frontend source
│   │   ├── components/            # UI components (Landing, Results, UploadZone, etc.)
│   │   ├── services/              # API clients & analysis orchestrators
│   │   └── App.tsx                # Main application component
│   └── server/                    # Python FastAPI backend
│       ├── app.py                 # FastAPI server & inference pipeline
│       ├── default_api.py         # Search & metadata enricher
│       └── requirements.txt       # Backend dependencies
└── README.md
`

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** & **npm**
- **Git** & **Git LFS** (optional, for model files)

---

### 1. Clone the Repository
`ash
git clone https://github.com/Morningstar777-star/Cattle-Breed-Identifier.git
cd Cattle-Breed-Identifier
`

---

### 2. Backend Setup (FastAPI + PyTorch)

1. Navigate to the server directory:
   `ash
   cd project/server
   `
2. Create and activate a virtual environment:
   `ash
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   `
3. Install dependencies:
   `ash
   pip install -r requirements.txt
   `
4. Start the backend API server:
   `ash
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   `
   * The API will be live at http://localhost:8000
   * Health check: http://localhost:8000/health
   * Interactive Swagger Docs: http://localhost:8000/docs

---

### 3. Frontend Setup (React + Vite)

1. In a separate terminal, navigate to the project directory:
   `ash
   cd project
   `
2. Copy .env.example to .env.local and add your API keys:
   `ash
   cp .env.example .env.local
   `
3. Install frontend dependencies:
   `ash
   npm install
   `
4. Launch the Vite development server:
   `ash
   npm run dev
   `
5. Open your browser at http://localhost:5173 (or http://localhost:5174).

---

### 4. Unified Full-Stack Run (Single Port)

Build the production frontend into project/dist:
`ash
cd project
npm run build
`
When project/dist exists, the FastAPI backend in project/server/app.py automatically serves the compiled frontend at the root:
`ash
cd project/server
python -m uvicorn app:app --host 0.0.0.0 --port 8000
`
Open **http://localhost:8000** in your browser to access the entire application from a single port!

---

## 📡 API Reference

### POST /classify
Upload an image of a cattle or bovine to receive real-time breed classification and health profile.

**Request:**
- Content-Type: multipart/form-data
- Body: ile (Image file: PNG, JPG, JPEG, WEBP)

**Sample Response:**
`json
{
  "breed": "Sahiwal",
  "confidence": 99.99,
  "top3": [
    { "label": "Sahiwal", "confidence": 99.99 },
    { "label": "Nagpuri", "confidence": 0.01 },
    { "label": "Hariana", "confidence": 0.00 }
  ],
  "species": "Bos indicus",
  "origin": "Punjab / Pakistan border region",
  "traits": ["High milk yield", "Heat and tick resistant", "Reddish-brown color"],
  "description": "Sahiwal is one of the best dairy breeds in India and Pakistan...",
  "care": {
    "feeding": "High quality green fodder and balanced mineral mix.",
    "housing": "Well-ventilated shaded stalls.",
    "veterinary": "Regular deworming and FMD vaccination."
  },
  "marketValue": {
    "milkYield": "15-25 L/day",
    "price": "Premium dairy pricing",
    "demand": "Very High"
  }
}
`

### GET /health
Returns backend service and model status.
`json
{
  "status": "ok",
  "model": "best_cattle_breed_model.pth"
}
`

---

## 🧠 Model Architecture & Training

- **Base Architecture**: ResNet-18 (Deep Residual Learning for Image Recognition)
- **Classifier Head**:
  - Dropout(0.2)
  - Linear(512 -> 512)
  - ReLU()
  - Dropout(0.2)
  - Linear(512 -> 41)
- **Input Preprocessing**:
  - Resize to 256x256
  - Center crop to 224x224
  - ImageNet normalization (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- **Classes (41 Breeds)**: Alambadi, Amritmahal, Bachaur, Bargur, Dangi, Deoni, Gaolao, Gir, Hallikar, Hariana, Kangayam, Kankrej, Kasaragod, Kherigarh, Khillari, Krishna Valley, Malnad Gidda, Malvi, Mewati, Nagori, Nimari, Ongole, Ponwar, Punganur, Rathi, Red Kandhari, Red Sindhi, Sahiwal, Siri, Tharparkar, Umblachery, Vechur, Jaffarabadi, Marathwada, Mehsana, Murrah, Nagpuri, Nili Ravi, Pandharpuri, Surti, and Toda.

---

## 📄 License

This project is licensed under the **MIT License**.
