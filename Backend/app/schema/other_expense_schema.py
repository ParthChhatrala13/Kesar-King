from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class OtherExpenseCreate(BaseModel):

    text: str
    amount: int

class OtherExpenseResponse(BaseModel):

    id: UUID
    text: str
    amount: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
