from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Account
from models.schemas import AccountCreate, AccountOut, MT5Summary
from services.mt5_service import mt5_service
from cryptography.fernet import Fernet
import os, base64

router = APIRouter()

# Derive a stable key from env or a fixed dev secret
_raw = os.getenv("VAULTEX_SECRET", "vaultex-dev-secret-key-32bytes!!")
_key = base64.urlsafe_b64encode(_raw[:32].encode())
fernet = Fernet(_key)


def encrypt(pwd: str) -> str:
    return fernet.encrypt(pwd.encode()).decode()


def decrypt(enc: str) -> str:
    return fernet.decrypt(enc.encode()).decode()


@router.get("/", response_model=list[AccountOut])
def list_accounts(db: Session = Depends(get_db)):
    return db.query(Account).all()


@router.post("/", response_model=AccountOut)
def create_account(payload: AccountCreate, db: Session = Depends(get_db)):
    acct = Account(
        label=payload.label,
        login=payload.login,
        server=payload.server,
        password_enc=encrypt(payload.password),
    )
    db.add(acct)
    db.commit()
    db.refresh(acct)
    return acct


@router.delete("/{account_id}")
def delete_account(account_id: int, db: Session = Depends(get_db)):
    acct = db.query(Account).filter(Account.id == account_id).first()
    if not acct:
        raise HTTPException(404, "Account not found")
    db.delete(acct)
    db.commit()
    return {"deleted": True}


@router.post("/{account_id}/activate", response_model=MT5Summary)
def activate_account(account_id: int, db: Session = Depends(get_db)):
    acct = db.query(Account).filter(Account.id == account_id).first()
    if not acct:
        raise HTTPException(404, "Account not found")

    db.query(Account).update({"is_active": False})
    acct.is_active = True
    db.commit()

    pwd = decrypt(acct.password_enc)
    ok = mt5_service.connect(int(acct.login), acct.server, pwd)
    if not ok:
        raise HTTPException(400, "Failed to connect to MT5")

    return mt5_service.get_account_summary()


@router.get("/active/summary", response_model=MT5Summary)
def get_summary():
    return mt5_service.get_account_summary()
