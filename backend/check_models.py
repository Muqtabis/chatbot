# check_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv() # Load your .env file

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("Available models for your API key:")
for m in genai.list_models():
  # Check if the model supports the 'generateContent' method
  if 'generateContent' in m.supported_generation_methods:
    print(f"- {m.name}")