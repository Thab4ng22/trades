'use client'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import NavBar from '@/components/layout/NavBar'
import JournalEntry from '@/components/trade/JournalEntry'
import { useAccounts } from '@/hooks/useAccounts'
import { useTrades } from '@/hooks/useTrades'
import { formatCurrency, formatDuration } from '@/lib/utils'
import type { Trade } from '@/types'
import { BookOpen, Tag } from 'lucide-react'
import { clsx } from 'clsx'

export default function JournalPage() {
  const { accounts, summary, activate } = useAccounts()
  const { trades, refresh } = useTrades('closed')
  const [journalTrade, setJournalTrade] = useState<Trade | null>(null)
  const [filterTag, setFilterTag] = useState('')

  const tags = Array.from(new Set(trades.flatMap(t => t.strategy_tag ? [t.strategy_tag] : [])))
  const filtered = filterTag ? trades.filter(t => t.strategy_tag === filterTag) : trades

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <TopBar accounts={accounts} summary={summary} onActivate={activate} onRefresh={refresh} />
      <NavBar />
      <main className="flex-1 p-5 flex flex-col gap-4">

        {tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={13} className="text-text-dim" />
            <button
              onClick={() => setFilterTag('')}
              className={`px-3 py-1 rounded-full text-[11px] border transition-all ${
                !filterTag ? 'bg-blue/20 border-blue text-blue' : 'border-border text-text-dim'
              }`}
            >
              All
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-[11px] border transition-all ${
                  filterTag === tag ? 'bg-blue/20 border-blue text-blue' : 'border-border text-text-dim hover:border-border-2'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {filtered.map(trade => (
            <div
              key={trade.id}
              onClick={() => setJournalTrade(trade)}
              className="bg-bg-3 border border-border rounded-card p-4 cursor-pointer hover:border-border-2 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-semibold text-sm text-text">{trade.symbol}</span>
                  <span className={clsx('ml-2 text-xs font-semibold font-mono', trade.type === 'BUY' ? 'text-green' : 'text-red')}>
                    {trade.type}
                  </span>
                </div>
                {trade.profit !== null && (
                  <span className={clsx(
                    'text-xs font-mono font-medium px-2 py-0.5 rounded',
                    trade.profit >= 0 ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                  )}>
                    {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                  </span>
                )}
              </div>

              {trade.strategy_tag && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue/10 text-blue border border-blue/20 mb-2">
                  <Tag size={9} />
                  {trade.strategy_tag}
                </span>
              )}

              {trade.journal_notes ? (
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{trade.journal_notes}</p>
              ) : (
                <p className="text-xs text-text-dim italic flex items-center gap-1">
                  <BookOpen size={11} /> No notes — click to add
                </p>
              )}

              <p className="text-[10px] text-text-dim font-mono mt-3">
                {formatDuration(trade.open_time, trade.close_time)} · {trade.lots} lots
              </p>
            </div>
          ))}
        </div>
      </main>

      {journalTrade && (
        <JournalEntry
          trade={journalTrade}
          onClose={() => setJournalTrade(null)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}
