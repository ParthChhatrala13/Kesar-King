import uuid
from sqlalchemy import Column, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database.db import Base

class PurchaseRecord(Base):

    __tablename__ = "purchase_records"

    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    total_box = Column(Integer)
    price = Column(Integer)
    transportation_charge = Column(Integer)
    total_cost = Column(Integer)
    final_cost = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())