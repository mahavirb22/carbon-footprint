# 🌍 CarbonIQ — Your Personal Carbon Footprint Guide

**CarbonIQ** is an interactive AI-powered assistant designed to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

> Built with a focus on clarity, accessibility, and modular AI-driven design.

---

## 🚀 Live Demo

🌐 **Frontend (Vercel)**
👉 [https://carbon-iq.vercel.app](https://carbon-iq.vercel.app)

⚙️ **Backend (Google Cloud Run)**
👉 [https://carbon-iq-api-XXXXXX.region.run.app](https://carbon-iq-api-XXXXXX.region.run.app)

---

## ✨ Overview

Climate change is a complex problem, and individuals often struggle to understand how their daily actions impact the environment. 

**CarbonIQ solves this by:**
* Providing a simple, real-time calculator for daily emissions (Transport, Food, Energy, Shopping).
* Offering an interactive AI Chat Assistant (powered by Google Gemini) to answer nuanced climate questions.
* Generating a personalized Action Plan based on your highest emission categories.
* Educating users through a timeline of climate milestones and an interactive quiz.

---

## 🌍 Supported Regions

Current static data and localized insights support the following regions:
* 🌐 Global
* 🇺🇸 United States
* 🇪🇺 Europe
* 🇬🇧 United Kingdom
* 🇦🇺 Australia

---

## 🧠 Core Features

### Real-Time Footprint Calculator
* Track everyday activities like driving, flying, eating beef, and buying clothes.
* See instant CO2 emission calculations based on standardized emission factors.

### Smart AI Assistant (Gemini)
* Chat naturally with a context-aware AI.
* The AI knows your footprint breakdown and provides hyper-personalized reduction tips.
* Utilizes client-side local matching for basic intents (greetings, thanks) to stay fast and efficient.

### Personalized Action Plan
* The Next Steps view automatically suggests actions targeting your worst emission areas.
* One-click deep-link to the AI assistant to learn how to achieve each step.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                        FRONTEND                        │
│                                                        │
│  [Views] ◄──► [Zustand Store] ◄──► [Local Storage]     │
│   (React)        (State)              (Persist)        │
│      │                                                 │
│      │                                                 │
│      ▼                                                 │
│ [Smart Engine] ──(Gemini API)──► Google AI Studio      │
│  (Calculation &                                        │
│   Local Fallbacks)                                     │
└────────────────────────────────────────────────────────┘
```

---

## 🧩 Feature Breakdown

| Feature | Description |
|---------|-------------|
| **AI Chat** | Personalized AI assistance powered by Gemini. |
| **Calculator** | Interactive form that calculates emissions by category. |
| **Lifecycle** | Visual accordion explaining the footprint behind everyday actions. |
| **Timeline** | A historical timeline of key climate treaties and targets. |
| **Quiz** | 3-question educational quiz with score tracking and explanations. |
| **Next Steps** | Dynamic action cards tailored to your footprint data. |

---

## 💬 Sample Interaction

**User:** How does a vegan diet help?

**CarbonIQ:**
* A vegan diet eliminates animal agriculture, which is a major source of methane and deforestation.
* It requires significantly less water and land to produce plant-based foods compared to meat.

👉 Suggested actions:
* Try Meatless Mondays.
* Swap dairy milk for oat or soy milk.

---

## 🖥️ UI/UX Design

```text
┌─────────────────────────┬────────────────────────────┐
│ 🌍 CarbonIQ             │ Ask the Carbon Assistant   │
│ ─────────────────────── │ ────────────────────────── │
│ 💬 AI Chat              │                            │
│ 🧮 Calculator           │ [Chat bubbles and          │
│ 🌱 Lifecycle            │  markdown rendering]       │
│ 📅 Timeline             │                            │
│ 🧠 Quiz                 │                            │
│ ✅ Next Steps           │ [     Type question...   ] │
└─────────────────────────┴────────────────────────────┘
```

### Design Principles
* Minimal & distraction-free with a calming "brand green" aesthetic.
* Guided interaction via clear navigation and personalized steps.
* Highly accessible (A11y compliant, ARIA attributes, semantic HTML, screen-reader optimized).

---

## ⚙️ Tech Stack

**Frontend**
* React 18 + Vite
* TypeScript
* Tailwind CSS
* Zustand (State Management)
* Vitest + React Testing Library

**Deployment**
* Vercel (Frontend Hosting)
* Docker (Containerization)

---

## 🔌 Scalability

* **Zustand `partialize`:** Efficiently syncs only critical data to Local Storage (like scores and inputs), preventing bloat from chat histories.
* **Component Lazy-loading Ready:** The flat route structure allows easy transition to React.lazy for code splitting if the app grows.

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mahavirb22/carbon-footprint.git
cd carbon-footprint

# Install dependencies
npm install

# Setup Environment Variables
# Create a .env file in the root directory and add:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
# VITE_GEMINI_MODEL=gemini-1.5-flash

# If you do not set VITE_GEMINI_MODEL, the app falls back to a supported Gemini model list.
# Rebuild and redeploy after changing these values so Cloud Run serves the updated bundle.

# Start the development server
npm run dev

# Run tests
npm run test
```

## Gemini API Troubleshooting (404 / 429)

- 404 `models/<name> is not found`: the model is unavailable for your API key/project.
- 429 `quota exceeded` with `limit: 0`: this project currently has no usable free-tier quota for that model.

Recommended fix path:

1. In Google AI Studio, confirm the API key belongs to the intended GCP project.
2. In that same project, enable billing (or use a project with available Gemini quota).
3. Set `VITE_GEMINI_MODEL` to a model shown as available in your project.
4. Rebuild and redeploy the frontend container. `VITE_*` values are baked at build time.
5. If still limited, create a new API key in AI Studio under the quota-enabled project and redeploy with that key.

---

## 🧪 Future Enhancements

* Integrate dynamic API emission factors (e.g., Climatiq API).
* Add user authentication and cloud syncing of footprint history.
* Include Gamification elements (badges, leaderboards).
