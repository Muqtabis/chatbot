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
    if not api_key:
        print("Warning: GOOGLE_API_KEY not found in environment variables.")
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
        # OPTIMIZATION 1: Use the fastest available model (2.5 Flash Lite)
        model_name = 'gemini-2.5-flash-lite' 
        
        # OPTIMIZATION 2: Set generation limits to prevent long stalls
        gen_config = genai.types.GenerationConfig(
            max_output_tokens=500, # Cap response length
            temperature=0.7        # Balance creativity and speed
        )

        model = genai.GenerativeModel(
            model_name,
            system_instruction=system_prompt,
            generation_config=gen_config
        )
        
        # OPTIMIZATION 3: Limit history to last 10 turns to reduce processing time
        # We take the last 11 items (10 history + 1 current prompt), then exclude the current prompt
        recent_history = history[-11:-1] if len(history) > 1 else []
        
        chat_session = model.start_chat(history=recent_history)
        
        # The new user message is the last item in the full history list
        new_user_message = history[-1]['parts'][0]
        
        # Send message to AI with streaming enabled
        response = chat_session.send_message(new_user_message, stream=True)
        
        # Stream the chunks back
        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        print(f"Error during stream generation: {e}")
        # Yield the error so the frontend sees something went wrong
        yield f"Error: {str(e)}"

# --- API Endpoints ---
@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    # Convert Pydantic models to the format Gemini expects
    formatted_history = [
        {"role": "user" if msg.role == "user" else "model", "parts": [msg.content]}
        for msg in request.history
    ]
    
    system_prompt = request.system_prompt or "You are a helpful assistant."
    
    return StreamingResponse(
        stream_generator(system_prompt, formatted_history), 
        media_type="text/plain"
    )