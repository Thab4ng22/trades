from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, Trade, Account
from models.schemas import MetricsOut, AnalyticsOut
from services.mt5_service import mt5_service
from services.analytics_service import compute_metrics, compute_analytics

router = APIRouter()


def _get_trades_raw(db: Session, account_id: int | None) -> list[dict]:
    q = db.query(Trade)
    if account_id:
        q = q.filter(Trade.account_id == account_id)
    trades = q.all()
    return [
        {
            "ticket": t.ticket,
            "symbol": t.symbol,
            "type": t.type,
            "lots": t.lots,
            "entry_price": t.entry_price,
            "exit_price": t.exit_price,
            "profit": t.profit,
            "open_time": t.open_time,
            "close_time": t.close_time,
            "status": t.status,
        }
        for t in trades
    ]


@router.get("/metrics", response_model=MetricsOut)
def get_metrics(db: Session = Depends(get_db)):
    active = db.query(Account).filter(Account.is_active == True).first()
    summary = mt5_service.get_account_summary()
    trades = _get_trades_raw(db, active.id if active else None)
    return compute_metrics(trades, summary.balance)


@router.get("/charts", response_model=AnalyticsOut)
def get_charts(db: Session = Depends(get_db)):
    active = db.query(Account).filter(Account.is_active == True).first()
    summary = mt5_service.get_account_summary()
    trades = _get_trades_raw(db, active.id if active else None)
    return compute_analytics(trades, summary.balance)
