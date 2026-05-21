import uuid
from sqlalchemy import Column, Integer, String, DateTime, func

from sqlalchemy.dialects.postgresql import UUID
from app.database.db import Base


class OtherExpense(Base):

    __tablename__ = "other_expenses"

    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    purchase_id = Column(UUID(as_uuid=True), nullable=True)
    text = Column(String)
    amount = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
