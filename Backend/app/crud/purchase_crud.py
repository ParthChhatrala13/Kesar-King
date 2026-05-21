from sqlalchemy.orm import Session
from app.model.purchase_model import PurchaseRecord


def create_purchase(db: Session, total_box: int, price: int, transportation_charge: int):
    total_cost = (total_box * price) + transportation_charge

    purchase = PurchaseRecord(
        total_box=total_box,
        price=price,
        transportation_charge=transportation_charge,
        total_cost=total_cost,
        final_cost=total_cost
    )

    db.add(purchase)
    db.commit()
    db.refresh(purchase)

    return purchase


# Get All Purchases
def get_all_purchase(db: Session):
    return db.query(PurchaseRecord).all()


# Get Single Purchase
def get_purchase(db: Session, purchase_id):
    return db.query(PurchaseRecord).filter(PurchaseRecord.id == purchase_id).first()


# Update Purchase
def update_purchase(db: Session, purchase_id, total_box: int, price: int, transportation_charge: int):
    purchase = db.query(PurchaseRecord).filter(PurchaseRecord.id == purchase_id).first()
    if purchase:
        purchase.total_box = total_box
        purchase.price = price
        purchase.transportation_charge = transportation_charge
        purchase.total_cost = (total_box * price) + transportation_charge
        purchase.final_cost = purchase.total_cost
        db.commit()
        db.refresh(purchase)
    return purchase


# Delete Purchase
def delete_purchase(db: Session, purchase_id):
    purchase = db.query(PurchaseRecord).filter(PurchaseRecord.id == purchase_id).first()
    if purchase:
        db.delete(purchase)
        db.commit()
    return purchase
