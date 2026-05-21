from fastapi import APIRouter, Depends
from app.database.db import get_db
from app.crud.purchase_crud import (create_purchase, get_all_purchase, get_purchase, update_purchase, delete_purchase)
from app.schema.purchase_schema import (PurchaseCreate)

router = APIRouter(prefix="/purchase",tags=["Purchase"])

@router.post("/")
def create(data: PurchaseCreate, db: Session = Depends(get_db)):

    return create_purchase(
        db=db,
        total_box=data.total_box,
        price=data.price,
        transportation_charge=data.transportation_charge
    )

@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return get_all_purchase(db)

@router.get("/{purchase_id}")
def get_one(purchase_id, db: Session = Depends(get_db)):
    return get_purchase(db, purchase_id)

@router.put("/{purchase_id}")
def update(purchase_id, data: PurchaseCreate, db: Session = Depends(get_db)):
    return update_purchase(
        db=db,
        purchase_id=purchase_id,
        total_box=data.total_box,
        price=data.price,
        transportation_charge=data.transportation_charge
    )

@router.delete("/{purchase_id}")
def delete(purchase_id, db: Session = Depends(get_db)):
    return delete_purchase(db, purchase_id)