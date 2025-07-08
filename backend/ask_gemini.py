import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")

#  Persona dictionary
personas = {
    "Einstein": "a genius physicist, deep thinker, values curiosity and logic.",
    "Krishna": "a divine philosopher from the Mahabharata, strategic, poetic, and deeply spiritual.",
    "Elon Musk": "a futuristic tech entrepreneur, bold, fast-thinking, and often provocative.",
    "Nietzsche": "a poetic existential philosopher, values individualism, truth, and overcoming."
}

#  Persona-based prompt builder
def build_persona_prompt(persona_name: str, topic: str, history: str, user_message: str) -> str:
    personality_style = personas.get(persona_name, "a thoughtful and intelligent individual.")

    if persona_name == "Krishna":
        return f"""
You are Lord Krishna, the divine guide of Arjuna from the Mahabharata. 
Speak with poetic grace, profound wisdom, and spiritual calmness — like the verses of the Bhagavad Gita.

You are debating a curious human on the topic: "{topic}"

Use analogies of nature, dharma, time, karma, and eternal truth.
Speak in elevated, poetic, metaphor-rich English — yet remain clear and persuasive.

Debate so far:
{history}
Human: {user_message}
Krishna:"""

    return f"""
You are {persona_name}, a famous figure known for {personality_style}.

You are debating a human on the topic: "{topic}"

Stay true to {persona_name}'s historical character, voice, and beliefs. Be insightful, consistent, and persuasive.

Debate so far:
{history}
Human: {user_message}
{persona_name}:"""

#  Main Gemini handler
def ask_gemini(persona: str, topic: str, history: str, user_input: str):
    try:
        prompt = build_persona_prompt(persona, topic, history, user_input)
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
        return "Hmm, I didn't quite get that. Can you rephrase?"
    except Exception as e:
        return f"Error from Gemini API: {e}"
