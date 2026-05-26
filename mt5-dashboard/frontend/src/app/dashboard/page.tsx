'use client'
import TopBar from '@/components/layout/TopBar'
import NavBar from '@/components/layout/NavBar'
import MetricCard from '@/components/ui/MetricCard'
import ChartCard from '@/components/ui/ChartCard'
import EquityCurve from '@/components/charts/EquityCurve'
import WinLossDonut from '@/components/charts/WinLossDonut'
import PairPerformance from '@/components/charts/PairPerformance'
import { WeekdayReturns, MonthlyReturns } from '@/components/charts/ReturnsCharts'
import TradeTable from '@/components/trade/TradeTable'
import JournalEntry from '@/components/trade/JournalEntry'
import { useAccounts } from '@/hooks/useAccounts'
import { useMetrics } from '@/hooks/useMetrics'
import { useTrades } from '@/hooks/useTrades'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Trade } from '@/types'
import { useState } from 'react'

export default function DashboardPage() {
  const { accounts, summary, refresh: refreshAcct, activate } = useAccounts()
  const { metrics, analytics, refresh: refreshMetrics } = useMetrics()
  const { trades, refresh: refreshTrades } = useTrades()
  const [journalTrade, setJournalTrade] = useState<Trade | null>(null)

  const handleRefresh = () => { refreshAcct(); refreshMetrics(); refreshTrades() }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <TopBar accounts={accounts} summary={summary} onActivate={activate} onRefresh={handleRefresh} />
      <NavBar />

      <main className="flex-1 p-5 flex flex-col gap-4 overflow-auto">

        {/* Metrics row 1 */}
        <div className="grid grid-cols-4 gap-2.5 lg:grid-cols-8">
          <MetricCard
            label="Balance" highlight
            value={summary ? formatCurrency(summary.balance) : '—'}
            sub={metrics ? (metrics.weekly_pnl >= 0 ? '↑ ' : '↓ ') + formatCurrency(metrics.weekly_pnl) + ' this week' : ''}
            subPositive={metrics ? metrics.weekly_pnl >= 0 : false}
          />
          <MetricCard
            label="Equity"
            value={summary ? formatCurrency(summary.equity) : '—'}
            sub={summary ? formatCurrency(summary.equity - summary.balance) + ' floating' : ''}
            subNegative={summary ? summary.equity < summary.balance : false}
            subPositive={summary ? summary.equity >= summary.balance : false}
          />
          <MetricCard
            label="Today P/L"
            value={metrics ? (metrics.today_pnl >= 0 ? '+' : '') + formatCurrency(metrics.today_pnl) : '—'}
            subPositive={metrics ? metrics.today_pnl >= 0 : false}
          />
          <MetricCard
            label="Monthly P/L"
            value={metrics ? (metrics.monthly_pnl >= 0 ? '+' : '') + formatCurrency(metrics.monthly_pnl) : '—'}
            subPositive={metrics ? metrics.monthly_pnl >= 0 : false}
          />
          <MetricCard
            label="Win Rate"
            value={metrics ? metrics.win_rate + '%' : '—'}
            sub={metrics ? `${metrics.winning_trades} / ${metrics.total_trades} trades` : ''}
          />
          <MetricCard
            label="Profit Factor"
            value={metrics ? String(metrics.profit_factor) : '—'}
            sub={metrics && metrics.profit_factor >= 2 ? 'Above target 2.0' : 'Below target 2.0'}
            subPositive={metrics ? metrics.profit_factor >= 2 : false}
          />
          <MetricCard
            label="Avg RR"
            value={metrics ? `1:${metrics.avg_rr}` : '—'}
          />
          <MetricCard
            label="Max Drawdown"
            value={metrics ? '-' + metrics.max_drawdown + '%' : '—'}
            subNegative
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <ChartCard title="Equity Curve" badge="90D">
              <EquityCurve data={analytics?.equity_curve ?? []} />
            </ChartCard>
          </div>
          <ChartCard title="Win / Loss">
            <WinLossDonut
              wins={metrics?.winning_trades ?? 0}
              losses={(metrics?.total_trades ?? 0) - (metrics?.winning_trades ?? 0)}
            />
            <div className="flex gap-4 mt-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-green">
                <span className="w-2 h-2 rounded-sm bg-green inline-block" />
                Win {metrics?.win_rate ?? 0}%
              </span>
              <span className="flex items-center gap-1.5 text-red">
                <span className="w-2 h-2 rounded-sm bg-red inline-block" />
                Loss {metrics ? (100 - metrics.win_rate).toFixed(1) : 0}%
              </span>
            </div>
          </ChartCard>
        </div>

        {/* Mini charts */}
        <div className="grid grid-cols-3 gap-3">
          <ChartCard title="Pair Performance">
            <PairPerformance data={analytics?.pair_performance ?? []} />
          </ChartCard>
          <ChartCard title="Weekday Returns">
            <WeekdayReturns data={analytics?.weekday_returns ?? []} />
          </ChartCard>
          <ChartCard title="Monthly Returns">
            <MonthlyReturns data={analytics?.monthly_returns ?? []} />
          </ChartCard>
        </div>

        {/* Trade table */}
        <ChartCard title="Recent Trades" badge="Live">
          <TradeTable trades={trades.slice(0, 20)} onSelectTrade={setJournalTrade} />
        </ChartCard>
      </main>

      {journalTrade && (
        <JournalEntry
          trade={journalTrade}
          onClose={() => setJournalTrade(null)}
          onSaved={refreshTrades}
        />
      )}
    </div>
  )
}
