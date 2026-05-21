from pydantic import BaseModel, ConfigDict
from uuid import UUID

class MangoCreate(BaseModel):

    name: str
    contact_number: str
    city: str
    box: int
    price: int


class MangoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    contact_number: str
    city: str
    box: int
    price: int
    total_payment: int
    payment_status: bool
    delivery_status: bool

# Login Schema
class LoginSchema(BaseModel):
    code: str
