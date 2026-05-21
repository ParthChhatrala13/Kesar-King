from sqlalchemy.orm import Session
from app.model.other_expense_model import OtherExpense


def add_other_expense(db: Session, text, amount):
    expense = OtherExpense(
        purchase_id=None,
        text=text,
        amount=amount
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


# Get Expenses
def get_expenses(db: Session, purchase_id):
    return db.query(OtherExpense).filter(OtherExpense.purchase_id == purchase_id).all()


# Get All Expenses
def get_all_expenses(db: Session):
    return db.query(OtherExpense).all()


# Get Single Expense
def get_expense(db: Session, expense_id):
    return db.query(OtherExpense).filter(OtherExpense.id == expense_id).first()


# Update Expense
def update_expense(db: Session, expense_id, text: str, amount: int):
    expense = db.query(OtherExpense).filter(OtherExpense.id == expense_id).first()
    if expense:
        expense.text = text
        expense.amount = amount

        db.commit()
        db.refresh(expense)
    return expense


# Delete Expense
def delete_expense(db: Session, expense_id):
    expense = db.query(OtherExpense).filter(OtherExpense.id == expense_id).first()
    if expense:
        db.delete(expense)
        db.commit()
    return expense
