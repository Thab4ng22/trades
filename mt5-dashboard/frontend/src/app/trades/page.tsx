'use client'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import NavBar from '@/components/layout/NavBar'
import ChartCard from '@/components/ui/ChartCard'
import TradeTable from '@/components/trade/TradeTable'
import JournalEntry from '@/components/trade/JournalEntry'
import { useAccounts } from '@/hooks/useAccounts'
import { useTrades } from '@/hooks/useTrades'
import type { Trade } from '@/types'

export default function TradesPage() {
  const { accounts, summary, refresh: refreshAcct, activate } = useAccounts()
  const [filter, setFilter] = useState<string>('all')
  const { trades, refresh } = useTrades(filter === 'all' ? undefined : filter)
  const [journalTrade, setJournalTrade] = useState<Trade | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <TopBar accounts={accounts} summary={summary} onActivate={activate} onRefresh={() => { refreshAcct(); refresh() }} />
      <NavBar />
      <main className="flex-1 p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {['all', 'open', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                filter === f
                  ? 'bg-blue/20 border-blue text-blue'
                  : 'border-border text-text-dim hover:border-border-2 hover:text-text-muted'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-text-dim font-mono">{trades.length} trades</span>
        </div>
        <ChartCard title="Trade History">
          <TradeTable trades={trades} onSelectTrade={setJournalTrade} />
        </ChartCard>
      </main>
      {journalTrade && (
        <JournalEntry trade={journalTrade} onClose={() => setJournalTrade(null)} onSaved={refresh} />
      )}
    </div>
  )
}
