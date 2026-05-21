from fastapi import APIRouter, HTTPException

from app.core.config import SECRET_CODE
from app.schema.mango_schema import LoginSchema

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Simple Login API
@router.post("/login")
def login(data: LoginSchema):

    if data.code != SECRET_CODE:

        raise HTTPException(
            status_code=401,
            detail="Wrong Secret Code"
        )

    return {
        "message": "Login Successful"
    }


# Forgot Password API
@router.get("/forgot")
def forgot_password():

    return {
        "owner_number": "+919106467043"
    }
