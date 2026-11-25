# PrepAI — Your Personal AI Learning & Career Assistant

> **Prepare. Practice. Progress.**  
> *One platform. Every step of your placement and career preparation.*

PrepAI is a commercial-grade, full-stack AI-powered learning and placement preparation SaaS platform designed for college and engineering students. It unites academic CS learning, voice-enabled mock interviews, company-authentic online assessments, notes synthesis, personalized roadmaps, and proctored analytics in one elegant, distraction-free workspace.

---

## 🎨 Design Identity: Soft Pink × White × Lavender

PrepAI features a modern pastel aesthetic inspired by Notion and premium productivity tools:

- **Main Background:** Soft Off-White (`#FFF9FC`)
- **Primary Surfaces:** Pure White (`#FFFFFF`) with subtle border lines (`#F1E6EE`)
- **Blush & Rose Accents:** `#FCE7F3`, `#F9D5E5`, Primary Pink (`#E879A9`), Deep Rose (`#C65B89`)
- **Lavender Accents:** Light Lavender (`#EDE9FE`), Lavender Accent (`#A78BFA`)
- **Typography:** Plus Jakarta Sans (headings) & Inter (body)

---

## 🚀 Live Services

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **AI Engine Target:** `http://localhost:11434` (Ollama • Llama 3.2) with built-in pedagogical fallback engine

---

## 🔑 Demo Account Credentials

A pre-configured student profile is pre-seeded so you can test all features immediately:

| Email | Password | Pre-seeded Records |
| :--- | :--- | :--- |
| `demo@prepai.edu` | `password123` | Active streak, completed assessments, and mock interviews |

> **Pro Tip:** On the Login page ([http://localhost:5173/login](http://localhost:5173/login)), click **"Fill Demo Student (Alex Rivera)"** for instant 1-click access.

---

## 🌟 Core Modules & Capabilities

### 1. Context-Aware AI Study Assistant & Notes Hub
- Multi-turn conversational context powered by Llama 3.2 (e.g. asking about DBMS normalization followed by *"I didn't understand 2NF"*).
- Instant note synthesis: convert doubts, lecture notes, or explanations into structured revision summaries and flashcards.
- Automatic conversation title generation and MongoDB message history persistence.

### 2. Voice-Enabled Company Mock Interviews
- Non-repeating interview question banks tailored specifically for **Google, Amazon, Microsoft, Infosys, TCS, and Deloitte**.
- **Voice delivery:** AI speaks questions aloud using Web Speech API synthesis.
- **Verbal answering:** Candidate answers verbally using the microphone or types their response.
- In-depth AI evaluation across Technical Accuracy, Communication, and Problem Solving.

### 3. 18 Company Online Assessments (Mock OA Arena)
- **3 curated OA sets each** for Google, Amazon, Microsoft, Infosys, TCS, and Deloitte (18 assessments total).
- Clean starter code signatures across JavaScript, Python 3, and C++.
- **Live Automated Test Runner:** Tests code against structured sample and hidden test cases, reporting Expected vs. Actual output with execution time and memory usage.

### 4. Continuous Proctoring & Discipline Monitoring
- Ambient noise meter with sustained background chatter detection via Web Audio API.
- Webcam feed with multi-face and camera obstruction checks.
- Fullscreen enforcement and tab-switch detection (`visibilitychange`).
- Screen share stream authorization.
- 5-second grace period with auto-dismissing non-disruptive notices.

### 5. Structured Study Material Library
- Curated reference material covering Dynamic Programming, Database ACID Transactions, Operating System Synchronization, and Network Protocols.
- Search, filter by category and difficulty, reading modal, bookmarks, and completion checkoffs.

### 6. Preparation Roadmap & Real-Time Analytics
- Dynamic weekly roadmap tailored to your target role and current preparation level.
- Recharts visualizations: Weekly activity line charts and subject competency distributions derived entirely from actual database records.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, Framer Motion, Lucide React, Recharts, React Markdown |
| **Backend** | Node.js, Express.js, RESTful APIs, Morgan logger, Helmet security, Rate limiting |
| **Database** | MongoDB / Mongoose (with persistent embedded storage engine) |
| **Authentication** | JWT, bcryptjs password hashing, password reset tokens with Nodemailer |
| **AI Integration** | Configurable AI Service Layer, Ollama API (`http://localhost:11434`, Llama 3.2) + Offline Pedagogical Engine |
| **Code Runner** | Sandboxed Node VM test runner + Judge0 CE compiler |

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Vidushi1igdtuw/PrepAI--Your-Personal-AI-Learning-Career-Assistant.git
cd PrepAI--Your-Personal-AI-Learning-Career-Assistant
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Run the development servers
```bash
# In server directory:
node src/server.js

# In client directory (in another terminal):
npm run dev
```

Visit **http://localhost:5173** to launch PrepAI.
