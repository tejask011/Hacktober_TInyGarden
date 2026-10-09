# TinyGarden AI 🌿 — Local-First Botanical AI & Garden Assistant

> **Hacktoberfest 2026 Open-Source AI Challenge Submission (#hf26challenge)**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Open Source AI](https://img.shields.io/badge/AI-Open--Weight%20(Ollama)-orange.svg)](https://ollama.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-brightgreen.svg)](https://nodejs.org)

**TinyGarden AI** is a privacy-first, offline-capable AI botanical assistant and garden calendar hub built for Hacktoberfest 2026. It operates entirely on open-weight language models (`gemma2:2b`, `llama3.2`, `mistral`) running locally via **Ollama**, with zero dependence on paid cloud APIs, external tracking, or proprietary subscription keys.

---

## 🌟 Key Features

### 1. 💬 1-on-1 AI Botanical Chat
- Interactive real-time chat interface powered by local open-weight AI.
- Instant advice on plant care, soil prep, organic composting, pruning, and pest control.
- Quick prompt pills for one-click questions.

### 2. 🔍 Plant Health & Vision Helper
- Symptom-based foliar diagnostic scanner with photo upload support.
- Identifies likely causes (nitrogen deficiency, overwatering, fungal mildew, pest infestation) with step-by-step organic remedies.

### 3. 📅 Interactive Garden Calendar & Reminders (Google Calendar Layout)
- Full interactive **Month Grid View** with event pills for **Watering (💧)**, **Soil & Fertilizer (🌱)**, **Pruning (✂️)**, **Pest Inspection (🐛)**, and **Harvesting (🍎)**.
- Pin care tasks to specific dates, toggle completion status, and manage active reminders.

### 4. 📝 Garden Journal
- Log plant growth notes, planting dates, garden location, soil types, sunlight exposure, and watering frequencies with permanent local saving.

### 5. 🌳 Tree Plantation Planner
- Custom blueprint generator for community or backyard tree plantation drives (shade trees, fruit orchards, ecological restoration).
- Calculates optimal tree spacing, pit preparation guidelines, and long-term aftercare checklists.

### 6. 🧭 AI Planting Advisor
- Personalized crop recommendations based on location, climate region, soil type, sunlight, and available space.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite, Tailwind CSS + Custom CSS Variables, Lucide React Icons
- **Backend**: Node.js + Express REST API
- **Local AI Engine**: Ollama (Open-Weight Models: `gemma2:2b`, `llama3.2:1b`, `mistral`)
- **Offline Storage**: Local SQLite/JSON persistence store + Bundled Botanical Knowledge Base

---

## 🚀 Quick Start Guide

### Prerequisites
1. Install [Node.js (v18+)](https://nodejs.org).
2. Install [Ollama](https://ollama.com) and pull an open-weight model:
   ```bash
   ollama pull gemma2:2b
   ```

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tejask011/Hacktober_TInyGarden.git
   cd Hacktober_TInyGarden
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   npm start
   ```
   *The Express server will run on `http://localhost:3001`.*

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   *The React application will launch at `http://localhost:5173`.*

---

## 📐 System Architecture

```
+------------------+         HTTP API        +-------------------+
|  React Frontend  | <---------------------> |  Express Backend  |
|   (Vite Port     |                         |    (Port 3001)    |
|     5173)        |                         +---------+---------+
+------------------+                                   |
                                                       | Ollama Local API
                                             +---------v---------+
                                             |  Ollama AI Engine |
                                             |   (gemma2:2b)     |
                                             +-------------------+
```

---

## 🔒 Privacy & Open-Source AI

- **100% Privacy-First**: All plant journals, calendar schedules, and chat queries remain on your local machine.
- **Zero API Fees**: Eliminates reliance on paid OpenAI or Google Gemini API keys.
- **Resilient Fallback**: Includes an offline rule engine so core functions work even if Ollama is paused.

---

## 📜 License

MIT License — Created for the **Hacktoberfest Open-Source AI Challenge**.
