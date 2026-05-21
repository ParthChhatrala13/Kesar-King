from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.crud.other_expense_crud import (add_other_expense, get_expenses, get_expense, update_expense, delete_expense, get_all_expenses)
from app.schema.other_expense_schema import (OtherExpenseCreate)

router = APIRouter(prefix="/expense", tags=["Other Expense"])

# Add Expense
@router.post("/")
def create_expense(data: OtherExpenseCreate, db: Session = Depends(get_db)):

    return add_other_expense(
        db=db,
        text=data.text,
        amount=data.amount
    )

@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return get_all_expenses(db)

@router.get("/{purchase_id}")
def expenses(purchase_id, db: Session = Depends(get_db)):
    return get_expenses(db, purchase_id)

@router.get("/detail/{expense_id}")
def get_one(expense_id, db: Session = Depends(get_db)):
    return get_expense(db, expense_id)

@router.put("/{expense_id}")
def update(expense_id, data: OtherExpenseCreate, db: Session = Depends(get_db)):
    return update_expense(
        db=db,
        expense_id=expense_id,
        text=data.text,
        amount=data.amount
    )

@router.delete("/{expense_id}")
def delete(expense_id, db: Session = Depends(get_db)):
    return delete_expense(db, expense_id)
