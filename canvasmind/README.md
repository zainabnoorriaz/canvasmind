# CanvasMind 🎨✨

An AI-powered infinite whiteboard where the AI doesn't just chat with you — it collaborates with you directly on the canvas.

Instead of typing questions into a chat window, sketch, write, or drop shapes anywhere on an infinite board. Select any region and ask the AI to **explain**, **simplify**, **find mistakes**, **expand**, or give **examples** — and its answer appears right there on the canvas next to your work, like a tutor jotting a note beside you.

Not a side panel. Not a chatbot. The board itself.

---

## ✨ Features

- **Infinite whiteboard** — pan, zoom, and place content anywhere
- **Freehand pencil drawing** with color picker
- **Shapes** — rectangle, square, circle, star, with color picker
- **Text boxes** — click to add, double-click to edit in place
- **Eraser** — click any object to remove it
- **Region-based AI** — select any area and ask the AI to explain, simplify, find mistakes, expand, or give examples
- **AI writes directly on the canvas** — answers appear as styled notes next to your selection, not in a separate chat window
- **Follow-up AI panel** — keep asking questions about anything already on the board, with full context of the conversation
- **Handwriting & sketch recognition** — the AI can read hand-drawn diagrams and handwritten equations, powered by Gemini's multimodal API

---

## 📸 Screenshots

### The whiteboard
![CanvasMind frontend](./screenshots/1-frontend.png)

### Sketch it, ask about it
![Heart sketch with AI interaction](./screenshots/2-heart-interaction.png)

### Works with any shape
![Star shape example](./screenshots/3-star-shape.png)

### Reads handwritten equations
![Handwritten equation example](./screenshots/4-handwritten.png)

### Step-by-step explanations, written on the canvas
![AI explanation on canvas](./screenshots/5-explanation.png)

### Follow-up conversation, with context
![AI follow-up side panel](./screenshots/6-sidepanel.png)

---

## 🛠️ Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, Konva.js (react-konva)
**Backend:** FastAPI, Python
**AI:** Google Gemini (multimodal) via the `google-genai` SDK

---

## 🚀 Getting Started

### Frontend
```bash
cd canvasmind
npm install
npm run dev
```
Runs at `http://localhost:3000`

### Backend
```bash
cd canvasmind-backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install fastapi uvicorn python-multipart google-genai python-dotenv
uvicorn main:app --reload
```
Runs at `http://127.0.0.1:8000`

Create a `.env` file inside `canvasmind-backend` with your Gemini API key:
```
GEMINI_API_KEY=your_key_here
```

---

## 💡 What This Is Not

- Not another ChatGPT clone
- Not a PDF assistant
- Not a note-taking app
- Not a feature-packed dashboard

Just one focused experience: an AI that collaborates visually on a shared canvas.

---

## 🧠 Notable Challenges Solved

- Fixed a subtle Konva bug where dragging a shape would simultaneously drag the entire canvas, caused by a timing race between React state and Konva's internal drag handling
- Diagnosed and fixed a real performance issue — selection and pencil drawing were triggering a full React re-render on every pixel of mouse movement; rewrote the drag logic to update Konva nodes directly instead
- Built a context-aware follow-up chat by resending the original selected image alongside a running conversation transcript to Gemini

---

## 👤 Author

Built solo by Zainab Noor Riaz, as part of an AI engineering portfolio, alongside a CS & IT degree.
