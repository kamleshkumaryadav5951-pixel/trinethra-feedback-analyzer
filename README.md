# Trinethra Supervisor Feedback Analyzer

This is a Full-Stack application designed to reduce the manual effort required to analyze supervisor feedback transcripts for DeepThought Fellows from 45-60 minutes down to just a few seconds using local AI (Ollama).

## Setup Instructions

Follow these steps to get the app running locally.

### Prerequisites
1. **Node.js** (v18+)
2. **Ollama** installed on your machine ([Download here](https://ollama.com/))

### Step 1: Start Ollama
Ensure the Ollama application is running in the background. Then, pull the `llama3.2` model if you haven't already:
```bash
ollama pull llama3.2
```

### Step 2: Start the Backend
Open a new terminal window, navigate to the `backend` directory, install dependencies, and start the server.
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:3001`.

### Step 3: Start the Frontend
Open another terminal window, navigate to the `frontend` directory, install dependencies, and start the Vite dev server.
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

##  Model Choice

**Model Used:** `llama3.2`
**Why:** It is extremely lightweight, fast, and runs efficiently on most modern laptops without requiring dedicated GPUs. It performs exceptionally well at structured JSON generation and reasoning when provided with strict system prompts.

---

## Architecture Overview

The application follows a simple decoupled architecture:
1. **Frontend (React + Vite + Vanilla CSS)**: Provides a premium, glassmorphism UI for the psychology interns to paste transcripts and view structured results.
2. **Backend (Node.js + Express)**: Acts as an intermediary middleware. It reads the `rubric.json` and `context.md`, constructs a highly specific prompt, and communicates with the local LLM.
3. **Local LLM (Ollama)**: Receives the prompt, analyzes the transcript against the KPIs and Rubric, and outputs structured JSON data.

---

##  Design Challenges Tackled

### Challenge 1: One Prompt or Many?
**Approach:** One Prompt. 
Instead of making 5 separate LLM calls (which would multiply the latency by 5x), the backend constructs a single, highly detailed prompt that instructs the LLM to return a comprehensive JSON object containing the Evidence, Rubric Score, KPI Mapping, Gap Analysis, and Follow-up Questions all at once. This significantly improves speed and UX for the intern.

### Challenge 2: Structured Output Reliability
**Approach:** Enforced JSON Mode & Regex Fallback.
LLMs notoriously struggle to return *only* JSON without conversational filler. To solve this:
1. I enforce `format: "json"` in the Ollama API call.
2. I explicitly instruct the LLM in the prompt to return ONLY JSON without markdown.
3. I implemented a **Regex Fallback Parser** in the backend (`/\{[\s\S]*\}/`). If `JSON.parse` fails due to stray characters, the regex extracts the JSON block from the string and attempts parsing again.

---

##  Future Improvements (With More Time)
1. **Side-by-Side Transcript Highlighting:** Implement a feature where clicking on an Extracted Evidence quote on the right side highlights the exact sentence in the raw transcript on the left side.
2. **Streaming Responses:** Stream the JSON generation in chunks so the UI can progressively render the analysis (e.g., show the Score first while generating Gap Analysis), reducing perceived latency.
3. **Intern Feedback Loop (RLHF):** Add "Accept", "Reject", or "Edit" buttons next to each LLM suggestion. If an intern corrects a score, we could log that interaction to a database to fine-tune future prompts.

---


