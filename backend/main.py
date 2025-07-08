from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from ask_gemini import ask_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    sender: str
    text: str

class DebateInput(BaseModel):
    persona: str
    topic: str
    messages: List[Message]

@app.post("/ask")
async def ask(input: DebateInput):
    if not input.messages or input.messages[-1].sender.lower() != "user":
        return {"answer": "Last message must be from the user."}

    history = "\n".join([f"{m.sender.capitalize()}: {m.text.strip()}" for m in input.messages[:-1]])
    user_input = input.messages[-1].text.strip()

    answer = ask_gemini(input.persona, input.topic, history, user_input)
    return {"answer": answer}
