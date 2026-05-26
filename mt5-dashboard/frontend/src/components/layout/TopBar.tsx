'use client'
import { RefreshCw } from 'lucide-react'
import type { Account, MT5Summary } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface Props {
  accounts: Account[]
  summary: MT5Summary | null
  onActivate: (id: number) => void
  onRefresh: () => void
}

export default function TopBar({ accounts, summary, onActivate, onRefresh }: Props) {
  return (
    <header className="h-13 bg-bg-2 border-b border-border flex items-center px-5 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-sm tracking-widest">
        <span className="w-2 h-2 rounded-full bg-blue shadow-[0_0_8px_#3b82f6]" />
        VAULTEX
      </div>

      {/* Account switcher */}
      <div className="flex gap-1.5 ml-2">
        {accounts.map(acct => (
          <button
            key={acct.id}
            onClick={() => onActivate(acct.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide border transition-all
              ${acct.is_active
                ? 'bg-blue-dark border-blue text-white'
                : 'border-border-2 text-text-muted hover:border-blue hover:text-text'
              }`}
          >
            {acct.label}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      {summary && (
        <div className="ml-auto flex items-center gap-6 font-mono text-xs text-text-muted">
          <span>
            BAL <span className="text-text font-medium">{formatCurrency(summary.balance)}</span>
          </span>
          <span>
            EQ <span className={summary.equity >= summary.balance ? 'text-green' : 'text-red'}>
              {formatCurrency(summary.equity)}
            </span>
          </span>
          <span>
            FREE MARGIN <span className="text-text">{formatCurrency(summary.free_margin)}</span>
          </span>
        </div>
      )}

      {/* Live + Refresh */}
      <div className="flex items-center gap-3 ml-4">
        <span className="flex items-center gap-1.5 text-xs text-green font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          LIVE · MT5
        </span>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded bg-bg-3 border border-border-2 text-text-muted hover:text-blue hover:border-blue transition-all"
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  )
}
