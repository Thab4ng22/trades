from datetime import datetime, timedelta
from collections import defaultdict
from models.schemas import MetricsOut, ChartPoint, AnalyticsOut


def compute_metrics(trades: list[dict], balance: float) -> MetricsOut:
    closed = [t for t in trades if t["status"] == "closed" and t.get("profit") is not None]
    if not closed:
        return MetricsOut(
            win_rate=0, profit_factor=0, avg_rr=0, max_drawdown=0,
            today_pnl=0, weekly_pnl=0, monthly_pnl=0,
            total_trades=0, winning_trades=0,
        )

    wins = [t for t in closed if t["profit"] > 0]
    losses = [t for t in closed if t["profit"] <= 0]
    win_rate = len(wins) / len(closed) * 100

    gross_profit = sum(t["profit"] for t in wins) or 0
    gross_loss = abs(sum(t["profit"] for t in losses)) or 1
    profit_factor = round(gross_profit / gross_loss, 2)

    # Average RR approximation from profit distribution
    avg_win = gross_profit / len(wins) if wins else 0
    avg_loss = gross_loss / len(losses) if losses else 1
    avg_rr = round(avg_win / avg_loss, 2)

    # Drawdown from running equity
    running = balance
    peak = balance
    max_dd = 0
    for t in sorted(closed, key=lambda x: x.get("close_time") or datetime.min):
        running += t["profit"]
        if running > peak:
            peak = running
        dd = (peak - running) / peak * 100 if peak > 0 else 0
        if dd > max_dd:
            max_dd = dd

    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0)
    week_start = now - timedelta(days=now.weekday())
    month_start = now.replace(day=1, hour=0, minute=0, second=0)

    def pnl_since(dt):
        return sum(
            t["profit"] for t in closed
            if t.get("close_time") and t["close_time"] >= dt
        )

    return MetricsOut(
        win_rate=round(win_rate, 1),
        profit_factor=profit_factor,
        avg_rr=avg_rr,
        max_drawdown=round(max_dd, 2),
        today_pnl=round(pnl_since(today_start), 2),
        weekly_pnl=round(pnl_since(week_start), 2),
        monthly_pnl=round(pnl_since(month_start), 2),
        total_trades=len(closed),
        winning_trades=len(wins),
    )


def build_equity_curve(trades: list[dict], starting_balance: float) -> list[ChartPoint]:
    closed = [t for t in trades if t["status"] == "closed" and t.get("profit") is not None]
    sorted_trades = sorted(closed, key=lambda x: x.get("close_time") or datetime.min)
    points = []
    running = starting_balance
    for t in sorted_trades:
        running += t["profit"]
        label = t["close_time"].strftime("%b %d") if t.get("close_time") else ""
        points.append(ChartPoint(label=label, value=round(running, 2)))
    return points[-60:]  # last 60 data points


def build_monthly_returns(trades: list[dict], starting_balance: float) -> list[ChartPoint]:
    closed = [t for t in trades if t["status"] == "closed" and t.get("profit") is not None]
    monthly: dict[str, float] = defaultdict(float)
    for t in closed:
        if t.get("close_time"):
            key = t["close_time"].strftime("%b %Y")
            monthly[key] += t["profit"]

    points = []
    for month, pnl in sorted(monthly.items(), key=lambda x: datetime.strptime(x[0], "%b %Y")):
        pct = round(pnl / starting_balance * 100, 2)
        points.append(ChartPoint(label=month[:3], value=pct))
    return points[-12:]


def build_weekday_returns(trades: list[dict]) -> list[ChartPoint]:
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    day_pnl: dict[int, float] = defaultdict(float)
    for t in trades:
        if t["status"] == "closed" and t.get("close_time") and t.get("profit"):
            day_pnl[t["close_time"].weekday()] += t["profit"]
    return [ChartPoint(label=days[i], value=round(day_pnl.get(i, 0), 2)) for i in range(5)]


def build_pair_performance(trades: list[dict]) -> list[ChartPoint]:
    pair_pnl: dict[str, float] = defaultdict(float)
    for t in trades:
        if t["status"] == "closed" and t.get("profit"):
            pair_pnl[t["symbol"]] += t["profit"]
    sorted_pairs = sorted(pair_pnl.items(), key=lambda x: x[1], reverse=True)
    return [ChartPoint(label=sym, value=round(pnl, 2)) for sym, pnl in sorted_pairs[:8]]


def compute_analytics(trades: list[dict], balance: float) -> AnalyticsOut:
    return AnalyticsOut(
        equity_curve=build_equity_curve(trades, balance),
        monthly_returns=build_monthly_returns(trades, balance),
        weekday_returns=build_weekday_returns(trades),
        pair_performance=build_pair_performance(trades),
    )
