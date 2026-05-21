from fastapi import APIRouter, Depends
from uuid import UUID

from app.crud.mango_crud import *
from app.database.db import get_db
from app.schema.mango_schema import *

router = APIRouter(prefix="/mango",tags=["Mango Records"])


# Create Record
@router.post("/", response_model=MangoResponse)
def add_record(data: MangoCreate,db: Session = Depends(get_db)):
    return create_record(db, data)


# Get All Records
@router.get("/", response_model=list[MangoResponse])
def all_records(db: Session = Depends(get_db)):
    return get_all_records(db)


# Search By Name
@router.get("/search/{name}")
def search(name: str, db: Session = Depends(get_db)):
    return search_by_name(db, name)


# Pending Payments
@router.get("/pending")
def pending(db: Session = Depends(get_db)):
    return pending_payments(db)


# Payment Complete
@router.put("/payment/{record_id}")
def payment_done(record_id: UUID, db: Session = Depends(get_db)):
    return payment_complete(db, record_id)


# Delivery Complete
@router.put("/delivery/{record_id}")
def delivery_done(record_id: UUID, db: Session = Depends(get_db)):
    return delivery_complete(db, record_id)


# Delete Record
@router.delete("/{record_id}")
def delete(record_id: UUID, db: Session = Depends(get_db)):
    return delete_record(db, record_id)
