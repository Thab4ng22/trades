from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AccountCreate(BaseModel):
    label: str
    login: str
    server: str
    password: str


class AccountOut(BaseModel):
    id: int
    label: str
    login: str
    server: str
    is_active: bool

    model_config = {"from_attributes": True}


class MT5Summary(BaseModel):
    balance: float
    equity: float
    margin: float
    free_margin: float
    margin_level: Optional[float]


class TradeOut(BaseModel):
    id: int
    ticket: int
    symbol: str
    type: str
    lots: float
    entry_price: float
    exit_price: Optional[float]
    sl: Optional[float]
    tp: Optional[float]
    profit: Optional[float]
    open_time: datetime
    close_time: Optional[datetime]
    status: str
    journal_notes: Optional[str]
    strategy_tag: Optional[str]
    lessons: Optional[str]

    model_config = {"from_attributes": True}


class JournalUpdate(BaseModel):
    journal_notes: Optional[str]
    strategy_tag: Optional[str]
    lessons: Optional[str]


class MetricsOut(BaseModel):
    win_rate: float
    profit_factor: float
    avg_rr: float
    max_drawdown: float
    today_pnl: float
    weekly_pnl: float
    monthly_pnl: float
    total_trades: int
    winning_trades: int


class ChartPoint(BaseModel):
    label: str
    value: float


class AnalyticsOut(BaseModel):
    equity_curve: list[ChartPoint]
    monthly_returns: list[ChartPoint]
    weekday_returns: list[ChartPoint]
    pair_performance: list[ChartPoint]
