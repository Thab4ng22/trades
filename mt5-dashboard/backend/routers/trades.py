from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db, Trade, Account
from models.schemas import TradeOut, JournalUpdate
from services.mt5_service import mt5_service

router = APIRouter()


def _sync_trades(db: Session, account_id: int):
    """Pull fresh data from MT5 and upsert into SQLite."""
    open_pos = mt5_service.get_open_positions()
    history = mt5_service.get_trade_history(days=90)

    all_raw = open_pos + history
    existing_tickets = {t.ticket for t in db.query(Trade.ticket).filter(Trade.account_id == account_id)}

    for raw in all_raw:
        if raw["ticket"] in existing_tickets:
            db.query(Trade).filter(
                Trade.ticket == raw["ticket"], Trade.account_id == account_id
            ).update({
                "profit": raw.get("profit"),
                "exit_price": raw.get("exit_price"),
                "close_time": raw.get("close_time"),
                "status": raw.get("status", "closed"),
            })
        else:
            trade = Trade(
                account_id=account_id,
                ticket=raw["ticket"],
                symbol=raw["symbol"],
                type=raw["type"],
                lots=raw["lots"],
                entry_price=raw["entry_price"],
                exit_price=raw.get("exit_price"),
                sl=raw.get("sl"),
                tp=raw.get("tp"),
                profit=raw.get("profit"),
                open_time=raw["open_time"],
                close_time=raw.get("close_time"),
                status=raw.get("status", "closed"),
            )
            db.add(trade)
    db.commit()


@router.get("/", response_model=list[TradeOut])
def get_trades(
    status: str = Query(None, description="open | closed | all"),
    db: Session = Depends(get_db),
):
    active = db.query(Account).filter(Account.is_active == True).first()
    if active:
        _sync_trades(db, active.id)

    q = db.query(Trade)
    if active:
        q = q.filter(Trade.account_id == active.id)
    if status and status != "all":
        q = q.filter(Trade.status == status)
    return q.order_by(Trade.open_time.desc()).limit(200).all()


@router.patch("/{trade_id}/journal", response_model=TradeOut)
def update_journal(trade_id: int, payload: JournalUpdate, db: Session = Depends(get_db)):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not trade:
        from fastapi import HTTPException
        raise HTTPException(404, "Trade not found")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(trade, field, val)
    db.commit()
    db.refresh(trade)
    return trade
