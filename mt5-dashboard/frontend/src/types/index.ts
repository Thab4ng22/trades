export interface Account {
  id: number
  label: string
  login: string
  server: string
  is_active: boolean
}

export interface MT5Summary {
  balance: number
  equity: number
  margin: number
  free_margin: number
  margin_level: number | null
}

export interface Trade {
  id: number
  ticket: number
  symbol: string
  type: 'BUY' | 'SELL'
  lots: number
  entry_price: number
  exit_price: number | null
  sl: number | null
  tp: number | null
  profit: number | null
  open_time: string
  close_time: string | null
  status: 'open' | 'closed'
  journal_notes: string | null
  strategy_tag: string | null
  lessons: string | null
}

export interface Metrics {
  win_rate: number
  profit_factor: number
  avg_rr: number
  max_drawdown: number
  today_pnl: number
  weekly_pnl: number
  monthly_pnl: number
  total_trades: number
  winning_trades: number
}

export interface ChartPoint {
  label: string
  value: number
}

export interface Analytics {
  equity_curve: ChartPoint[]
  monthly_returns: ChartPoint[]
  weekday_returns: ChartPoint[]
  pair_performance: ChartPoint[]
}
