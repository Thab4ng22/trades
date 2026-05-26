'use client'
import TopBar from '@/components/layout/TopBar'
import NavBar from '@/components/layout/NavBar'
import ChartCard from '@/components/ui/ChartCard'
import EquityCurve from '@/components/charts/EquityCurve'
import DrawdownChart from '@/components/charts/DrawdownChart'
import PairPerformance from '@/components/charts/PairPerformance'
import { WeekdayReturns, MonthlyReturns } from '@/components/charts/ReturnsCharts'
import WinLossDonut from '@/components/charts/WinLossDonut'
import { useAccounts } from '@/hooks/useAccounts'
import { useMetrics } from '@/hooks/useMetrics'

export default function AnalyticsPage() {
  const { accounts, summary, refresh: refreshAcct, activate } = useAccounts()
  const { metrics, analytics, refresh } = useMetrics()

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <TopBar accounts={accounts} summary={summary} onActivate={activate} onRefresh={() => { refreshAcct(); refresh() }} />
      <NavBar />
      <main className="flex-1 p-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <ChartCard title="Equity Curve" badge="90D">
            <EquityCurve data={analytics?.equity_curve ?? []} />
          </ChartCard>
          <ChartCard title="Drawdown">
            <DrawdownChart data={analytics?.equity_curve ?? []} />
          </ChartCard>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ChartCard title="Performance by Pair">
            <PairPerformance data={analytics?.pair_performance ?? []} />
          </ChartCard>
          <ChartCard title="Weekday Returns">
            <WeekdayReturns data={analytics?.weekday_returns ?? []} />
          </ChartCard>
          <ChartCard title="Win / Loss">
            <WinLossDonut
              wins={metrics?.winning_trades ?? 0}
              losses={(metrics?.total_trades ?? 0) - (metrics?.winning_trades ?? 0)}
            />
          </ChartCard>
        </div>
        <ChartCard title="Monthly Returns">
          <MonthlyReturns data={analytics?.monthly_returns ?? []} />
        </ChartCard>
      </main>
    </div>
  )
}
