# VAULTEX — Premium MT5 Trading Dashboard

Institutional-grade trading analytics for MetaTrader 5 accounts.

---

## Prerequisites

- **Python 3.10+** (Windows only for MT5 live data — MetaTrader5 package is Windows-only)
- **Node.js 18+**
- MetaTrader 5 desktop app installed and logged in

---

## Quick Start

### 1. Backend (Python FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux (mock mode only)
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend starts at `http://localhost:8000`.  
On non-Windows systems, it automatically falls back to **mock data mode**.

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Project Structure

```
mt5-dashboard/
├── README.md
├── backend/
│   ├── main.py                  # FastAPI app + CORS
│   ├── requirements.txt
│   ├── database.py              # SQLite setup
│   ├── models/
│   │   └── schemas.py           # Pydantic models
│   ├── routers/
│   │   ├── accounts.py          # Account CRUD + switching
│   │   ├── trades.py            # Trade history + open positions
│   │   └── analytics.py        # Computed metrics + chart data
│   └── services/
│       ├── mt5_service.py       # MetaTrader5 integration
│       └── analytics_service.py # P/L, win rate, drawdown calc
└── frontend/
    ├── next.config.js
    ├── tailwind.config.ts
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx          # → redirects to /dashboard
    │   │   ├── dashboard/page.tsx
    │   │   ├── trades/page.tsx
    │   │   ├── analytics/page.tsx
    │   │   ├── journal/page.tsx
    │   │   └── settings/page.tsx
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── TopBar.tsx
    │   │   │   └── NavBar.tsx
    │   │   ├── ui/
    │   │   │   ├── MetricCard.tsx
    │   │   │   └── ChartCard.tsx
    │   │   ├── charts/
    │   │   │   ├── EquityCurve.tsx
    │   │   │   ├── WinLossDonut.tsx
    │   │   │   ├── PairPerformance.tsx
    │   │   │   ├── WeekdayReturns.tsx
    │   │   │   ├── MonthlyReturns.tsx
    │   │   │   └── DrawdownChart.tsx
    │   │   └── trade/
    │   │       ├── TradeTable.tsx
    │   │       └── JournalEntry.tsx
    │   ├── hooks/
    │   │   ├── useAccounts.ts
    │   │   ├── useTrades.ts
    │   │   └── useMetrics.ts
    │   ├── lib/
    │   │   ├── api.ts            # Axios client
    │   │   └── utils.ts          # formatters
    │   └── types/
    │       └── index.ts
```

---

## Features

- Live MT5 connection via `MetaTrader5` Python package
- Multiple account storage (SQLite, encrypted passwords)
- Auto-refresh every 15 seconds
- Full dashboard: balance, equity, margin, P/L, win rate, profit factor, drawdown
- 6 charts: equity curve, win/loss donut, pair performance, weekday/monthly returns, drawdown
- Full trade table with all fields
- Trade journal with notes, tags, strategy, screenshots
- Responsive desktop + mobile layouts
