from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.ai_chat import ask_ai, ask_ai_completion

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/ai-chat")
async def ai_chat(data: ChatRequest):
    return ask_ai(data.question)

@router.post("/ai-complete")
async def ai_complete(data: ChatRequest):
    return ask_ai_completion(data.question)