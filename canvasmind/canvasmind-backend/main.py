from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

# Load the API key from .env
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Allows the Next.js frontend (running on a different port) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "CanvasMind backend is running"}

@app.post("/chat-followup")
async def chat_followup(
    image: UploadFile = File(...),
    history: str = Form(...),
    question: str = Form(...),
):
    # Read the original selected image again (same one used for the first answer)
    image_bytes = await image.read()

    # Build a plain-text transcript of the conversation so far
    prompt = (
        "You are continuing a conversation about the image below. "
        "Here is the conversation so far:\n"
        f"{history}\n\n"
        f"New question: {question}\n\n"
        "Answer the new question, using the image and the conversation history as context. "
        "Write in plain text only — no LaTeX, no markdown symbols like ** or #."
    )

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=image.content_type),
            prompt,
        ],
    )

    return {"result": response.text}


@app.post("/explain-region")

async def explain_region(
    image: UploadFile = File(...),
    action: str = Form("explain"),
):
    image_bytes = await image.read()

    style_note = " Write in plain text only — no LaTeX, no markdown symbols like ** or #. For math, use plain notation like x^2 or sqrt(x), not LaTeX formatting like $$...$$."

    prompts = {
        "explain": "Explain what is shown in this image clearly and concisely." + style_note,
        "simplify": "Simplify the concept shown in this image for a beginner." + style_note,
        "find_mistakes": "Find any mistakes or errors in this image and explain them." + style_note,
        "expand": "Expand on the idea shown in this image with more detail." + style_note,
        "examples": "Give practical examples related to what's shown in this image." + style_note,
    }
    instruction = prompts.get(action, prompts["explain"])

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=image.content_type),
            instruction,
        ],
    )

    return {"result": response.text}