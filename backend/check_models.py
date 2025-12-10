import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your API key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: API Key not found in .env file")
else:
    print(f"Using API Key: {api_key[:5]}... (hidden)")
    try:
        genai.configure(api_key=api_key)
        print("\n--- AVAILABLE MODELS ---")
        found_any = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found_any = True
        
        if not found_any:
            print("No models found. Check your API key permissions.")
            
    except Exception as e:
        print(f"\nError connecting to Google: {e}")