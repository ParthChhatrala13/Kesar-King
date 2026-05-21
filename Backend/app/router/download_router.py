"""
Download router for exporting data to Excel and PDF
"""

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.crud.mango_crud import get_all_records
from app.crud.purchase_crud import get_all_purchase
from app.crud.other_expense_crud import get_all_expenses
from app.utils.export import create_excel_file, create_pdf_file
from datetime import datetime

router = APIRouter(prefix="/download", tags=["Download"])


def _format_date(value):
    if isinstance(value, str):
        return value
    if hasattr(value, "strftime"):
        return value.strftime('%Y-%m-%d')
    return "N/A"


@router.get("/mango/excel")
def download_mango_excel(db: Session = Depends(get_db)):
    """Download all mango records as Excel"""
    records = get_all_records(db)
    
    headers = ["ID", "Name", "Contact", "City", "Boxes", "Price/Box", "Total Payment", "Payment Status", "Delivery Status", "Date"]
    data = []
    for r in records:
        data.append([
            str(r.id)[:8],
            r.name,
            r.contact_number,
            r.city,
            r.box,
            f"₹{r.price}",
            f"₹{r.total_payment}",
            "Paid" if r.payment_status else "Pending",
            "Delivered" if r.delivery_status else "Pending",
            _format_date(r.created_at) if hasattr(r, 'created_at') and r.created_at else 'N/A'
        ])
    
    excel_file = create_excel_file("Mango Records", headers, data)
    
    return StreamingResponse(
        iter([excel_file.getvalue()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=Mango_Records_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"}
    )


@router.get("/mango/pdf")
def download_mango_pdf(db: Session = Depends(get_db)):
    """Download all mango records as PDF"""
    records = get_all_records(db)
    
    headers = ["ID", "Name", "Contact", "City", "Boxes", "Price/Box", "Total", "Payment", "Delivery", "Date"]
    data = []
    for r in records:
        data.append([
            str(r.id)[:8],
            r.name,
            r.contact_number,
            r.city,
            str(r.box),
            f"₹{r.price}",
            f"₹{r.total_payment}",
            "Paid" if r.payment_status else "Pending",
            "Delivered" if r.delivery_status else "Pending",
            _format_date(r.created_at) if hasattr(r, 'created_at') and r.created_at else 'N/A'
        ])
    
    pdf_file = create_pdf_file("Mango Records Report", headers, data)
    
    return StreamingResponse(
        iter([pdf_file.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Mango_Records_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"}
    )


@router.get("/purchase/excel")
def download_purchase_excel(db: Session = Depends(get_db)):
    """Download all purchase records as Excel"""
    purchases = get_all_purchase(db)
    
    headers = ["ID", "Boxes", "Price/Box", "Transport", "Total Cost", "Final Cost", "Date"]
    data = []
    for p in purchases:
        data.append([
            str(p.id)[:8],
            p.total_box,
            f"₹{p.price}",
            f"₹{p.transportation_charge}",
            f"₹{(p.total_box * p.price) + p.transportation_charge}",
            f"₹{p.final_cost}",
            _format_date(p.created_at) if p.created_at else 'N/A'
        ])
    
    excel_file = create_excel_file("Purchase Records", headers, data)
    
    return StreamingResponse(
        iter([excel_file.getvalue()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=Purchase_Records_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"}
    )


@router.get("/purchase/pdf")
def download_purchase_pdf(db: Session = Depends(get_db)):
    """Download all purchase records as PDF"""
    purchases = get_all_purchase(db)
    
    headers = ["ID", "Boxes", "Price/Box", "Transport", "Total", "Final Cost", "Date"]
    data = []
    for p in purchases:
        data.append([
            str(p.id)[:8],
            str(p.total_box),
            f"₹{p.price}",
            f"₹{p.transportation_charge}",
            f"₹{(p.total_box * p.price) + p.transportation_charge}",
            f"₹{p.final_cost}",
            _format_date(p.created_at) if p.created_at else 'N/A'
        ])
    
    pdf_file = create_pdf_file("Purchase Records Report", headers, data)
    
    return StreamingResponse(
        iter([pdf_file.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Purchase_Records_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"}
    )


@router.get("/expense/excel")
def download_expense_excel(db: Session = Depends(get_db)):
    """Download all expense records as Excel"""
    expenses = get_all_expenses(db)
    
    headers = ["ID", "Description", "Amount", "Date"]
    data = []
    for e in expenses:
        data.append([
            str(e.id)[:8],
            e.text,
            f"₹{e.amount}",
            _format_date(e.created_at) if e.created_at else 'N/A'
        ])
    
    excel_file = create_excel_file("Expense Records", headers, data)
    
    return StreamingResponse(
        iter([excel_file.getvalue()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=Expense_Records_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"}
    )


@router.get("/expense/pdf")
def download_expense_pdf(db: Session = Depends(get_db)):
    """Download all expense records as PDF"""
    expenses = get_all_expenses(db)
    
    headers = ["ID", "Description", "Amount", "Date"]
    data = []
    for e in expenses:
        data.append([
            str(e.id)[:8],
            e.text,
            f"₹{e.amount}",
            _format_date(e.created_at) if e.created_at else 'N/A'
        ])
    
    pdf_file = create_pdf_file("Expense Records Report", headers, data)
    
    return StreamingResponse(
        iter([pdf_file.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Expense_Records_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"}
    )
