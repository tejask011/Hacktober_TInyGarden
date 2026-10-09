---
title: TinyGarden AI — Local-First AI Assistant for Home Gardening & Plantation
published: true
tags: hacktoberfest, ai, open weight, react, node, ollama
---

### Problem Statement: TinyGarden AI — Offline Gardening and Plantation Assistant

Many people want to grow plants, maintain home gardens, or participate in tree plantation activities but lack accessible, personalized guidance. Beginners often struggle to determine which plants are suitable for their region, season, soil conditions, sunlight availability, and available space. They may also find it difficult to follow appropriate watering schedules, understand planting requirements, and maintain plants over time.

Existing digital gardening assistants may rely on cloud-based AI services, continuous internet connectivity, or paid APIs, creating barriers for users who need a low-cost and privacy-conscious alternative.

There is a need for an accessible, intelligent gardening assistant that provides personalized planting recommendations, gardening instructions, seasonal guidance, and plant-care planning while minimizing dependence on external services.

TinyGarden AI addresses this problem by using locally executed open-weight AI models, bundled gardening reference information, and locally stored user records to help people make informed gardening decisions and encourage practical outdoor activities.

---

### Proposed Solution: TinyGarden AI

TinyGarden AI is a local-first AI-powered gardening assistant that provides personalized guidance for home gardening, plant care, and tree plantation. The application uses an open-weight language model running locally through Ollama (`gemma2:2b`) to generate planting plans, explain gardening techniques, recommend suitable plants based on user-provided conditions, and create personalized care schedules.

Users can enter their location or region, soil type, sunlight availability, gardening space, and planting preferences to receive recommendations supported by a bundled gardening knowledge base. The application also maintains a local garden journal, watering reminders, planting calendars, growth records, and a 1-on-1 AI chat assistant.

An image-analysis and symptom module uses locally running vision and diagnostic logic to suggest possible plant identities or visible plant-health issues from uploaded photographs or symptom notes.

TinyGarden AI is designed to provide its core gardening features without paid AI APIs, cloud-based inference, or a Google billing account. Offline mode relies on available local data and user-entered conditions.

---

### Main Features

1. **AI Planting Advisor**
   Suggests optimal plants based on region, season, soil type, sunlight, available space, and user preferences (with preset and custom write-in input support).

2. **Tree Plantation Planner**
   Generates pit preparation instructions, spacing guidance, aftercare schedules, and maintenance checklists for tree species during plantation drives.

3. **1-on-1 AI Gardening Chat**
   Direct interactive conversation with Ollama (`gemma2:2b`) for real-time gardening tips, organic pest control advice, and soil management queries.

4. **Plant Health & Identification Helper**
   Analyze plant images or leaf symptom descriptions for diagnostic explanations and organic remedies.

5. **Smart Gardening Calendar & Journal**
   Tracks planting dates, watering schedules, fertilizer tasks, and growth notes stored locally on disk.

6. **Offline Gardening Knowledge Base**
   Bundled regional growing reference data allowing the AI and user to access trusted planting rules without a live web connection.

---

### Technology Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React + Vite |
| **Styling** | Vanilla CSS + Tailwind CSS utilities |
| **Backend** | Node.js + Express |
| **Local AI Runtime** | Ollama |
| **Language Model** | Gemma 2 (`gemma2:2b`) open-weight model |
| **Knowledge Retrieval** | Local JSON reference database (`server/data/gardening_knowledge.json`) |
| **Database** | Local JSON store (`tinygarden_store.json`) |
| **API Costs** | USD $0.00 (Zero paid AI cloud endpoints) |

---

### System Architecture

```
React Frontend (Vite)
 ├── Plant details & soil inputs
 ├── 1-on-1 AI Gardening Chat
 ├── Garden journal & task calendar
 └── Offline reference library
         │
         ▼ (HTTP API)
Express Backend
 ├── Prompt building & input validation
 ├── Local knowledge retrieval
 └── LLM Service (Ollama / Fallback engine)
         │
         ▼
Ollama Open-Weight Model (Gemma 2)
 └── Personalized planting plans, tree blueprints, 1-on-1 chat & health diagnosis
```

---

### What Makes TinyGarden AI Suitable for the Challenge?

- **Open-Weight AI Integration**: Uses downloadable models via Ollama (`gemma2:2b`) instead of proprietary paid cloud APIs.
- **Environmental & Outdoor Impact**: Encourages urban gardening, home farming, and tree plantation drives.
- **Complete Privacy**: All user garden logs and location parameters remain strictly on the user's local hardware.
- **Offline Reliability**: Core guidance functions smoothly even in disconnected outdoor areas.
- **Zero Paid Dependencies**: Fully operational without requiring credit cards or Google API keys.
