# 🏥 AI-Powered Virtual Medical Assistant and Smart Doctor Calling Agent

> **MediAssist AI** - An intelligent healthcare platform that uses AI to analyze symptoms, recommend doctors, and automate medical office communications.

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black)
![Express.js](https://img.shields.io/badge/Backend-Express.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Python](https://img.shields.io/badge/ML-Python%2FFastAPI-yellow)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Component Status](#-component-status)
- [What's Left To Do](#-whats-left-to-do)
- [API Documentation](#-api-documentation)
- [Team Members](#-team-members)

---

## 🎯 Project Overview

MediAssist AI is a comprehensive healthcare platform that combines:

1. **AI Chatbot** - Conversational interface for patients to describe symptoms
2. **Disease Prediction** - ML model that predicts conditions based on symptoms
3. **Doctor Recommendations** - Location-based doctor suggestions by specialty
4. **Smart Calling Agent** - VAPI-powered voice assistant for doctor offices
5. **Appointment Management** - Automated booking and notifications via n8n

---

## ✨ Features

### For Patients
- 💬 Natural language symptom description
- 🧠 AI-powered disease prediction with confidence scores
- 👨‍⚕️ Doctor recommendations based on condition and location
- 📅 Online appointment booking
- 📱 SMS/Email notifications

### For Doctors
- 📊 Dashboard with appointment overview
- 📞 AI-powered call handling (VAPI)
- 📝 Automated message taking
- 📈 Analytics and call logs
- 🔔 Real-time notifications

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, React 18, TailwindCSS, Framer Motion |
| **Backend** | Express.js, TypeScript, Prisma ORM |
| **Database** | PostgreSQL |
| **ML Model** | Python, scikit-learn, FastAPI |
| **AI/Chat** | OpenAI GPT-4o-mini |
| **Voice Agent** | VAPI.ai |
| **Automation** | n8n Workflows |
| **Notifications** | Twilio (SMS), Email |

---

## 📁 Project Structure

```
├── backend/                    # Express.js Backend API
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Database seeding script
│   ├── src/
│   │   ├── config/
│   │   │   └── vapi.config.ts  # VAPI configuration
│   │   ├── lib/
│   │   │   ├── openai.ts       # OpenAI integration
│   │   │   └── prisma.ts       # Prisma client
│   │   ├── routes/
│   │   │   ├── appointment.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── doctor.routes.ts
│   │   │   ├── symptom.routes.ts
│   │   │   ├── vapi.routes.ts
│   │   │   └── webhook.routes.ts
│   │   └── index.ts            # Server entry point
│   ├── env.example
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── src/app/
│   │   ├── page.tsx            # Landing page
│   │   ├── chat/page.tsx       # Patient chat interface
│   │   ├── doctor/page.tsx     # Doctor dashboard
│   │   ├── appointments/page.tsx # Appointment booking
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── tailwind.config.js
│   └── package.json
│
├── ml-model/                   # Python ML Service
│   ├── app.py                  # FastAPI server
│   ├── train_model.py          # Model training script
│   ├── requirements.txt
│   ├── data/                   # Training data (to be added)
│   └── models/                 # Trained models (generated)
│
├── n8n-workflows/              # Automation Workflows
│   ├── appointment-workflow.json
│   ├── appointment-reminder-workflow.json
│   ├── doctor-calling-agent-workflow.json
│   └── symptom-analysis-workflow.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Let's go"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

### 4. ML Model Setup

```bash
cd ml-model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model (generates sample data if Kaggle dataset not present)
python train_model.py

# Start the API server
python app.py
```

### 5. n8n Setup (Optional)

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Import workflows from n8n-workflows/ folder via n8n UI
```

---

## ✅ Component Status

### ✅ Completed Components

| Component | Status | Description |
|-----------|--------|-------------|
| **Backend API** | ✅ Complete | Express.js server with all routes |
| **Database Schema** | ✅ Complete | Prisma schema with all models |
| **Database Seeding** | ✅ Complete | Sample data for testing |
| **Frontend Landing** | ✅ Complete | Beautiful landing page |
| **Patient Chat UI** | ✅ Complete | Chat interface with symptom analysis |
| **Doctor Dashboard** | ✅ Complete | Dashboard with appointments & calls |
| **Appointment Booking** | ✅ Complete | Full booking flow |
| **ML Model Training** | ✅ Complete | scikit-learn model with sample data |
| **ML API Server** | ✅ Complete | FastAPI prediction endpoint |
| **OpenAI Integration** | ✅ Complete | Chat completion with symptom extraction |
| **VAPI Routes** | ✅ Complete | Backend routes for VAPI integration |
| **VAPI Configuration** | ✅ Complete | Assistant config with functions |
| **n8n Workflows** | ✅ Complete | 4 workflow templates |
| **Authentication** | ✅ Complete | JWT-based auth with registration/login |

---

## ⏳ What's Left To Do

### 🔴 Critical (Must Have)

| Task | Priority | Estimated Time | Notes |
|------|----------|----------------|-------|
| **VAPI Account Setup** | High | 1-2 hours | Sign up at vapi.ai, get API key, configure phone number |
| **OpenAI API Key** | High | 30 min | Get API key from OpenAI dashboard |
| **PostgreSQL Database** | High | 1 hour | Set up local or cloud PostgreSQL instance |
| **Kaggle Dataset** | Medium | 1 hour | Download disease prediction dataset for better ML accuracy |

### 🟡 Important (Should Have)

| Task | Priority | Estimated Time | Notes |
|------|----------|----------------|-------|
| **n8n Instance Deployment** | Medium | 2-3 hours | Deploy n8n and import workflows |
| **Twilio Setup** | Medium | 1-2 hours | For SMS notifications in n8n workflows |
| **Email Service Setup** | Medium | 1 hour | Configure SMTP for email notifications |
| **VAPI Webhook Configuration** | Medium | 1 hour | Set webhook URL in VAPI dashboard |
| **VAPI Phone Number** | Medium | 30 min | Purchase and assign phone number in VAPI |

### 🟢 Nice to Have (Could Have)

| Task | Priority | Estimated Time | Notes |
|------|----------|----------------|-------|
| **Production Deployment** | Low | 4-6 hours | Deploy to Vercel/Railway/AWS |
| **User Profile Management** | Low | 2-3 hours | Edit profile, medical history |
| **Doctor Registration Flow** | Low | 3-4 hours | Doctors can self-register |
| **Advanced Analytics** | Low | 4-5 hours | Charts and statistics for doctors |
| **Multi-language Support** | Low | 3-4 hours | Urdu language support |
| **Mobile App** | Low | 2-3 weeks | React Native mobile app |

---

## 📝 Step-by-Step Setup Guide

### Setting Up VAPI (Calling Agent)

1. **Create VAPI Account**
   - Go to [https://vapi.ai](https://vapi.ai)
   - Sign up for an account
   - Navigate to Dashboard → API Keys
   - Copy your API key

2. **Configure Environment**
   ```env
   VAPI_API_KEY=your_vapi_api_key_here
   ```

3. **Create Assistant**
   - Use the API endpoint `POST /api/vapi/assistant/create`
   - Or create manually in VAPI dashboard using config from `backend/src/config/vapi.config.ts`

4. **Configure Webhook**
   - In VAPI dashboard, set webhook URL to: `https://your-domain.com/api/vapi/webhook`
   - Select events: `call-started`, `call-ended`, `function-call`, `transcript`

5. **Assign Phone Number**
   - Purchase a phone number in VAPI dashboard
   - Assign it to your assistant

### Setting Up n8n Workflows

1. **Install n8n**
   ```bash
   npm install -g n8n
   n8n start
   ```

2. **Import Workflows**
   - Open n8n at `http://localhost:5678`
   - Go to Workflows → Import from File
   - Import each JSON file from `n8n-workflows/` folder

3. **Configure Credentials**
   - Set up HTTP Request credentials for backend API
   - Set up Twilio credentials for SMS
   - Set up Email credentials for notifications

4. **Set Environment Variables**
   ```
   BACKEND_URL=http://localhost:5000
   ML_MODEL_URL=http://localhost:8000
   ```

5. **Activate Workflows**
   - Enable each workflow
   - Test with sample data

### Downloading Kaggle Dataset

1. **Create Kaggle Account**
   - Go to [https://kaggle.com](https://kaggle.com)
   - Sign up and verify email

2. **Download Dataset**
   - Go to: [Disease Prediction Dataset](https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning)
   - Click "Download"
   - Extract files

3. **Place in Project**
   ```bash
   cp Training.csv ml-model/data/
   cp Testing.csv ml-model/data/
   ```

4. **Retrain Model**
   ```bash
   cd ml-model
   python train_model.py
   ```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new patient |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/analyze` | Analyze symptoms and get recommendations |
| GET | `/api/chat/session/:id` | Get chat session history |

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/:id` | Get doctor details |
| GET | `/api/doctors/specialty/:name` | Get doctors by specialty |
| POST | `/api/doctors/:id/reviews` | Add review |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/patient/:id` | Get patient appointments |
| GET | `/api/appointments/doctor/:id` | Get doctor appointments |
| GET | `/api/appointments/slots/:doctorId` | Get available slots |
| PATCH | `/api/appointments/:id/status` | Update appointment status |

### VAPI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vapi/assistant/create` | Create VAPI assistant for doctor |
| GET | `/api/vapi/calls/:doctorId` | Get call logs |
| POST | `/api/vapi/webhook` | VAPI webhook handler |
| POST | `/api/vapi/call/outbound` | Initiate outbound call |

### ML Model Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Predict disease from symptoms |
| GET | `/symptoms` | List all symptoms |
| GET | `/diseases` | List all diseases |
| GET | `/health` | Health check |

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medical_assistant"

# OpenAI
OPENAI_API_KEY=sk-...

# VAPI
VAPI_API_KEY=...
VAPI_PHONE_NUMBER=+1...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# ML Model
ML_MODEL_API_URL=http://localhost:8000

# n8n Webhooks
N8N_WEBHOOK_APPOINTMENT=http://localhost:5678/webhook/appointment
N8N_WEBHOOK_CALL=http://localhost:5678/webhook/call
N8N_WEBHOOK_NOTIFICATION=http://localhost:5678/webhook/notification
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 👥 Team Members

| Name | Roll No | Role |
|------|---------|------|
| **Muhammad Aatir** | 22-CS-09 | AI/ML Model & n8n Workflows |
| **Mudassir Rizwan** | 22-CS-30 | Frontend Development (Next.js) |
| **Shariq Mateen** | 22-CS-96 | Backend Development (Express.js) |

**Supervisor:** Dr. Syed Aun Irtaza

**Department:** Computer Science, UET Taxila

---

## 📄 License

This project is developed as a Final Year Project for academic purposes.

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- VAPI for voice AI platform
- n8n for workflow automation
- Kaggle for the disease prediction dataset
- UET Taxila for academic support

---

## 📞 Support

For any questions or issues, please contact the team members or create an issue in the repository.

---

**Built with ❤️ by the MediAssist AI Team**

