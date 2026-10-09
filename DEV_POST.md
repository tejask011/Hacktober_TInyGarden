---
title: TinyGarden AI 🌿 — Local-First AI Assistant for Home Gardening & Plantation
published: true
tags: hf26challenge, hacktoberfest, ai, openweight, react, node, ollama
cover_image: https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80
---

> **Submission for the Hacktoberfest 2026 Open-Source AI Challenge (#hf26challenge)**

### GitHub Repository: [https://github.com/tejask011/Hacktober_TInyGarden](https://github.com/tejask011/Hacktober_TInyGarden)

---

### 🌿 Problem Statement

Many urban gardeners, beginners, and community environmental groups want to cultivate plants or conduct tree plantation drives but lack accessible, personalized guidance. Beginners often struggle with:
1. Identifying which plants or tree species match their local climate, soil conditions, and sunlight.
2. Managing watering, fertilizing, and pruning schedules without over-complicating plant care.
3. Diagnosing leaf discoloration, fungal diseases, or pest attacks using organic remedies.

Existing digital gardening apps rely on paid cloud AI APIs, continuous internet connectivity, and invasive tracking. There is a strong need for an **accessible, privacy-first, offline-capable AI gardening assistant** that runs 100% locally with $0 API cost.

---

### 💡 Proposed Solution: TinyGarden AI

**TinyGarden AI** is an open-source, local-first botanical AI application designed to empower anyone to plant and maintain gardens and trees. It runs directly on top of **Ollama** using local open-weight models (`gemma2:2b`, `llama3.2`, `mistral`), requiring **zero paid cloud APIs, zero credit cards, and zero data telemetry**.

---

### 🌟 Key Features

1. **💬 1-on-1 AI Gardening Chat**
   - Live interactive chat assistant powered by local Ollama open-weight LLMs.
   - Provides instant answers for soil preparation, organic pest control, pruning, and composting.

2. **🔍 Foliage Health & Vision Diagnostic Helper**
   - Symptom-based foliar diagnostic scanner with photo upload support.
   - Outputs suspected issues (e.g. nitrogen deficiency, powdery mildew, overwatering) alongside step-by-step organic treatment recipes.

3. **📅 Interactive Garden Calendar & Reminders**
   - **Google Calendar-style Month Grid View** with color-coded event chips:
     - 💧 **Watering**
     - 🌱 **Add Soil & Fertilizer**
     - ✂️ **Pruning & Mulching**
     - 🐛 **Pest Inspection**
     - 🍎 **Harvesting**

4. **📝 Garden Journal**
   - Log plant growth notes, planting dates, soil mix, location, watering frequencies, and custom notes stored permanently on disk.

5. **🌳 Tree Plantation Planner**
   - Specialized blueprint generator for tree plantation drives (shade trees, fruit orchards, eco-restoration).
   - Calculates optimal spacing metrics, pit preparation guides, and aftercare checklists.

6. **🧭 AI Planting Advisor**
   - Recommends crops and foliage tailored to region, season, soil type, sunlight, and available space with write-in support.

---

### 🛠️ Technology Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19 + Vite, Tailwind CSS + Custom CSS, Lucide Icons |
| **Backend** | Node.js + Express REST API |
| **Local AI Engine** | Ollama (`gemma2:2b`, `llama3.2`, `mistral` open-weight LLMs) |
| **Storage & Reference** | Local SQLite/JSON store (`tinygarden_store.json`) + Bundled Botanical DB |
| **API Fees** | **USD $0.00** (100% free local open-source AI execution) |

---

### 📐 System Architecture

```
React 19 Frontend (Vite)
 ├── 1-on-1 AI Gardening Chat
 ├── Plant Health Scanner & Vision Diagnostics
 ├── Google Calendar Month Grid & Reminders
 └── Garden Growth Journal
         │
         ▼ (HTTP API)
Express Backend (Node.js)
 ├── Local Botanical Knowledge Base
 └── Ollama LLM Service Handler
         │
         ▼
Ollama Open-Weight AI Model (gemma2:2b)
 └── Generates local AI responses, disease diagnostics & plantation blueprints
```

---

### 🎯 What Makes TinyGarden AI Stand Out for Hacktoberfest?

- **Pure Open-Source AI**: Runs entirely on open-weight LLMs via Ollama. No proprietary closed APIs.
- **100% Privacy & Offline Capability**: All garden records and prompts remain on your local disk.
- **Environmental Impact**: Promotes biodiversity, urban gardening, home agriculture, and community tree planting.

---

### 🔗 Code & Repositories

- **GitHub Repository**: [https://github.com/tejask011/Hacktober_TInyGarden](https://github.com/tejask011/Hacktober_TInyGarden)
- **Built for**: Hacktoberfest 2026 Open-Source AI Challenge (#hf26challenge)
