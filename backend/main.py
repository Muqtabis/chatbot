from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Optional, AsyncGenerator
from fastapi.responses import StreamingResponse

# --- Setup and Configuration ---
load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://chatbot-frontend-jib1.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    system_prompt: Optional[str] = None

# --- Streaming Logic ---
async def stream_generator(system_prompt: str, history: List[dict]) -> AsyncGenerator[str, None]:
    try:
        # We use 'gemini-2.5-flash' because it has the best free-tier limits (1500/day)
        # 'gemini-pro-latest' often hits the 50/day limit too fast.
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            system_instruction=system_prompt
        )
        
        chat_session = model.start_chat(history=history[:-1])
        new_user_message = history[-1]['parts'][0]
        
        # Send message to AI
        response = chat_session.send_message(new_user_message, stream=True)
        
        # Stream the chunks back
        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        # This will print the exact error to your terminal so we can fix it
        print(f"Error during stream generation: {e}")
        yield f"Error: {str(e)}"

# --- API Endpoints ---
@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    formatted_history = [
        {"role": "user" if msg.role == "user" else "model", "parts": [msg.content]}
        for msg in request.history
    ]
    
    system_prompt = request.system_prompt or "You are a helpful assistant."
    
    return StreamingResponse(stream_generator(system_prompt, formatted_history), media_type="text/plain")
