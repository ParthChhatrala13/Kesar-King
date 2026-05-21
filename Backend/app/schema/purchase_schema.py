from pydantic import BaseModel
from uuid import UUID

class PurchaseCreate(BaseModel):

    total_box: int
    price: int
    transportation_charge: int

class PurchaseResponse(BaseModel):

    id: UUID
    total_box: int
    price: int
    transportation_charge: int
    total_cost: int
    final_cost: int

    class Config:
        from_attributes = True