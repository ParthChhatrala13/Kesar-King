from sqlalchemy.orm import Session
from app.model.mango_model import MangoRecord
from app.schema.mango_schema import MangoCreate


# Create Record
def create_record(db: Session, data: MangoCreate):
    total_payment = data.box * data.price

    new_record = MangoRecord(
        name=data.name,
        contact_number=data.contact_number,
        city=data.city,
        box=data.box,
        price=data.price,
        total_payment=total_payment
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


# Get All Records
def get_all_records(db: Session):
    return db.query(MangoRecord).all()


# Search By Name
def search_by_name(db: Session, name: str):
    return db.query(MangoRecord).filter(
        MangoRecord.name.ilike(f"%{name}%")
    ).all()


# Pending Payments
def pending_payments(db: Session):
    return db.query(MangoRecord).filter(
        MangoRecord.payment_status == False
    ).all()


# Update Payment
def payment_complete(db: Session, record_id: str):
    record = db.query(MangoRecord).filter(
        MangoRecord.id == record_id
    ).first()

    if record:
        record.payment_status = True
        db.commit()
        db.refresh(record)

    return record


# Update Delivery
def delivery_complete(db: Session, record_id: str):
    record = db.query(MangoRecord).filter(
        MangoRecord.id == record_id
    ).first()

    if record:
        record.delivery_status = True
        db.commit()
        db.refresh(record)

    return record


# Delete Record
def delete_record(db: Session, record_id: str):
    record = db.query(MangoRecord).filter(
        MangoRecord.id == record_id
    ).first()

    if record:
        db.delete(record)
        db.commit()
        return {"message": "Record Deleted"}

    return {"message": "Record not found"}
