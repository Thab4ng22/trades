"""
MT5 Service — wraps the MetaTrader5 Python package.
On non-Windows systems (or if MT5 is not installed), falls back to mock data.
"""
import platform
import random
from datetime import datetime, timedelta
from models.schemas import MT5Summary

MT5_AVAILABLE = False

if platform.system() == "Windows":
    try:
        import MetaTrader5 as mt5
        MT5_AVAILABLE = True
    except ImportError:
        pass


class MT5Service:
    def __init__(self):
        self.connected = False
        self.login_id = None

    def connect(self, login: int, server: str, password: str) -> bool:
        if not MT5_AVAILABLE:
            self.connected = True
            self.login_id = login
            return True

        if not mt5.initialize():
            return False

        auth = mt5.login(login, password=password, server=server)
        if auth:
            self.connected = True
            self.login_id = login
        return auth

    def disconnect(self):
        if MT5_AVAILABLE and self.connected:
            mt5.shutdown()
        self.connected = False

    def get_account_summary(self) -> MT5Summary:
        if MT5_AVAILABLE and self.connected:
            info = mt5.account_info()
            if info:
                return MT5Summary(
                    balance=info.balance,
                    equity=info.equity,
                    margin=info.margin,
                    free_margin=info.margin_free,
                    margin_level=info.margin_level,
                )

        # Mock
        balance = 48320.50
        return MT5Summary(
            balance=balance,
            equity=balance - random.uniform(200, 800),
            margin=1240.00,
            free_margin=balance - 1240.00,
            margin_level=3900.0,
        )

    def get_open_positions(self) -> list[dict]:
        if MT5_AVAILABLE and self.connected:
            positions = mt5.positions_get()
            if positions:
                return [
                    {
                        "ticket": p.ticket,
                        "symbol": p.symbol,
                        "type": "BUY" if p.type == 0 else "SELL",
                        "lots": p.volume,
                        "entry_price": p.price_open,
                        "sl": p.sl,
                        "tp": p.tp,
                        "profit": p.profit,
                        "open_time": datetime.fromtimestamp(p.time),
                        "status": "open",
                    }
                    for p in positions
                ]

        # Mock open positions
        now = datetime.utcnow()
        return [
            {
                "ticket": 100001,
                "symbol": "XAUUSD",
                "type": "BUY",
                "lots": 0.50,
                "entry_price": 2318.40,
                "sl": 2305.00,
                "tp": 2345.00,
                "profit": -43.50,
                "open_time": now - timedelta(hours=1, minutes=22),
                "status": "open",
            }
        ]

    def get_trade_history(self, days: int = 90) -> list[dict]:
        if MT5_AVAILABLE and self.connected:
            from_date = datetime.utcnow() - timedelta(days=days)
            deals = mt5.history_deals_get(from_date, datetime.utcnow())
            if deals:
                return [
                    {
                        "ticket": d.order,
                        "symbol": d.symbol,
                        "type": "BUY" if d.type == 0 else "SELL",
                        "lots": d.volume,
                        "entry_price": d.price,
                        "exit_price": d.price,
                        "profit": d.profit,
                        "close_time": datetime.fromtimestamp(d.time),
                        "status": "closed",
                    }
                    for d in deals
                    if d.symbol
                ]

        # Mock history
        symbols = ["EURUSD", "GBPUSD", "NAS100", "USDJPY", "XAUUSD", "BTCUSD"]
        trades = []
        base_time = datetime.utcnow() - timedelta(days=90)
        ticket = 99000

        for i in range(76):
            sym = random.choice(symbols)
            is_win = random.random() < 0.68
            profit = random.uniform(80, 620) if is_win else -random.uniform(40, 280)
            open_t = base_time + timedelta(days=random.uniform(0, 88))
            trades.append(
                {
                    "ticket": ticket + i,
                    "symbol": sym,
                    "type": random.choice(["BUY", "SELL"]),
                    "lots": round(random.choice([0.25, 0.50, 0.75, 1.0, 1.5]), 2),
                    "entry_price": round(random.uniform(1.05, 2400), 3),
                    "exit_price": round(random.uniform(1.05, 2400), 3),
                    "sl": None,
                    "tp": None,
                    "profit": round(profit, 2),
                    "open_time": open_t,
                    "close_time": open_t + timedelta(hours=random.uniform(0.5, 12)),
                    "status": "closed",
                }
            )
        return sorted(trades, key=lambda t: t["close_time"], reverse=True)


mt5_service = MT5Service()
