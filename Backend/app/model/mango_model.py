from sqlalchemy import UUID, Column, Integer, String, Boolean

from app.database.db import Base
import uuid


class MangoRecord(Base):

    __tablename__ = "mango_records"

    id = Column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4,index=True)    
    name = Column(String)
    contact_number = Column(String)
    city = Column(String)
    box = Column(Integer)
    price = Column(Integer)
    total_payment = Column(Integer)
    payment_status = Column(Boolean, default=False)
    delivery_status = Column(Boolean, default=False)
