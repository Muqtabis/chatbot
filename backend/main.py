# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Optional, AsyncGenerator
from fastapi.responses import StreamingResponse

# --- Setup and Configuration (no changes) ---
load_dotenv()
app = FastAPI()
# ... (CORS middleware setup is the same)
origins = [
    "http://localhost:3000",
    "https://chatbot-frontend-jib1.onrender.com",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Error configuring Google AI: {e}")

# --- Pydantic Models ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    # 1. Add an optional field for the system prompt
    system_prompt: Optional[str] = None

# --- Streaming Logic ---
async def stream_generator(system_prompt: str, history: List[dict]) -> AsyncGenerator[str, None]:
    try:
        # 2. Add the system prompt when creating the model instance
        model = genai.GenerativeModel(
            'gemini-pro-latest',
            system_instruction=system_prompt
        )
        
        chat_session = model.start_chat(history=history[:-1])
        new_user_message = history[-1]['parts'][0]
        
        response = chat_session.send_message(new_user_message, stream=True)
        
        for chunk in response:
            yield chunk.text
    except Exception as e:
        print(f"Error during stream generation: {e}")
        yield "Error: Could not get response from AI."

# --- API Endpoints ---
@app.get("/")
def root():
    """
    A simple endpoint to confirm the server is running.
    This is what Render's health checker will hit.
    """
    return {"status": "ok", "message": "Backend is running!"}
@app.post("/chat")
async def chat(request: ChatRequest):
    formatted_history = [
        {"role": "user" if msg.role == "user" else "model", "parts": [msg.content]}
        for msg in request.history
    ]
    
    # 3. Use the system prompt from the request, or a default if none is provided
    system_prompt = request.system_prompt or "You are a helpful assistant."
    
    return StreamingResponse(stream_generator(system_prompt, formatted_history), media_type="text/plain")