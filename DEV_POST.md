---
title: TinyGarden AI 🌿 — Touch Grass with Local Open-Weight AI & Privacy-First Gardening
published: true
tags: hf26challenge, hacktoberfest, ai, openweight, react, node, ollama
cover_image: https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## 🌿 What I Built

**TinyGarden AI** is an open-source, local-first botanical assistant and garden calendar hub built to get people **off their screens, outdoors, and touching grass**. 

Many beginners want to cultivate fresh herbs, grow home vegetables, or plant trees, but get overwhelmed by confusing advice, overwatering, or unidentified leaf pests. Existing gardening apps force users to sign up for paid cloud AI subscriptions, share location data, and stay tethered to the cloud.

**TinyGarden AI** changes that by putting an intelligent, privacy-first botanical guide right on your computer. Powered 100% by local open-weight AI models via **Ollama**, it runs with **zero paid cloud APIs, zero credit cards, and zero data telemetry**.

### 🚀 Key Features to Help You Touch Grass:
- 💬 **1-on-1 AI Botanical Chat**: Ask real-time questions about soil mix, organic composting, pruning, and crop choices.
- 🔍 **Plant Health & Vision Diagnostic Helper**: Upload a leaf photo or describe symptoms to receive instant diagnosis and step-by-step organic remedies.
- 📅 **Interactive Garden Calendar & Reminders**: A Google Calendar-style month grid with event chips for **Watering (💧)**, **Soil & Fertilizer (🌱)**, **Pruning (✂️)**, **Pest Inspection (🐛)**, and **Harvesting (🍎)**.
- 📝 **Garden Journal**: Record your plant observations, soil preparation logs, sapling growth notes, and harvesting milestones.
- 🌳 **Tree Plantation Planner**: Generate customized blueprints for community tree plantation drives (shade trees, fruit orchards, eco-restoration) complete with spacing math and pit prep guides.

---

## 📺 Demo

- **GitHub Repository**: [https://github.com/tejask011/Hacktober_TInyGarden](https://github.com/tejask011/Hacktober_TInyGarden)

### 📸 Application Highlights
- **Google Calendar Month View**: Track watering & care tasks on an interactive month grid.
- **1-on-1 AI Assistant**: Live streaming chat powered by Ollama running locally.
- **Plant Health Scanner**: Upload foliage photos for organic treatment recipes.

---

## 💻 Code

{% github tejask011/Hacktober_TInyGarden %}

```bash
# Clone and run locally in under 2 minutes
git clone https://github.com/tejask011/Hacktober_TInyGarden.git
cd Hacktober_TInyGarden

# Backend Setup
cd server && npm install && npm start

# Frontend Setup (in a new terminal)
cd ../client && npm install && npm run dev
```

---

## 🛠️ How I Built It

This was **my very first time building an application with Ollama**, and the experience was incredible! 

### Open-Source AI Stack:
- **Local AI Inference Engine**: [Ollama](https://ollama.com) running open-weight models (`gemma2:2b`, `llama3.2`, `mistral`).
- **Frontend**: React 19 + Vite, Vanilla CSS + Tailwind CSS utilities, Lucide React Icons.
- **Backend**: Node.js + Express REST API.
- **Offline Knowledge Base**: Local JSON database (`server/data/gardening_knowledge.json`) integrated into the local LLM prompt chain.

### How Open-Source AI Powers TinyGarden:
1. When a user asks a question or scans a leaf symptom, Express constructs a context-aware prompt enriched by the local botanical database.
2. The prompt is sent to the local **Ollama** API endpoint (`http://127.0.0.1:11434/api/generate`).
3. The open-weight model streams back personalized organic advice directly to the React frontend.
4. If Ollama is offline, a built-in rule engine acts as an instant fallback so the app remains **100% functional offline**.

---

## 🔓 Why Does Open Innovation Matter?

Open innovation and open-weight AI matter deeply for projects like TinyGarden AI:

1. **True Privacy**: Your gardening notes, balcony location details, and plant logs never leave your device.
2. **Zero Subscription Barrier**: Anyone with standard hardware can run state-of-the-art open models like `gemma2:2b` or `llama3.2` for **$0.00 in cloud API fees**.
3. **Offline Resilience**: Whether you are in a remote backyard garden, a community farm, or an outdoor tree plantation site without internet, your AI assistant continues to work seamlessly.

Closed proprietary APIs lock users behind monthly paywalls and API rate limits. Open-weight models democratize AI technology for everyone.

---

## 🏆 Prize Categories

- **Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass** (Main Track)

---

*Built with ❤️ for Hacktoberfest 2026! Happy gardening and don't forget to touch grass! 🌿*
