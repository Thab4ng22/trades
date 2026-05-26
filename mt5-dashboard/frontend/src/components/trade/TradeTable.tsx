'use client'
import type { Trade } from '@/types'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { clsx } from 'clsx'

interface Props {
  trades: Trade[]
  onSelectTrade?: (trade: Trade) => void
}

export default function TradeTable({ trades, onSelectTrade }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr>
            {['Symbol', 'Type', 'Lots', 'Entry', 'Exit', 'SL', 'TP', 'Profit', 'Duration', 'Status'].map(h => (
              <th
                key={h}
                className="text-left py-2 px-2 text-[10px] font-semibold tracking-wider text-text-dim uppercase border-b border-border"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map(t => (
            <tr
              key={t.id}
              onClick={() => onSelectTrade?.(t)}
              className="border-b border-border hover:bg-bg-4 cursor-pointer transition-colors group"
            >
              <td className="py-2 px-2 text-text font-semibold">{t.symbol}</td>
              <td className={clsx('py-2 px-2 font-semibold', t.type === 'BUY' ? 'text-green' : 'text-red')}>
                {t.type}
              </td>
              <td className="py-2 px-2 text-text-muted">{t.lots.toFixed(2)}</td>
              <td className="py-2 px-2 text-text-muted">{t.entry_price}</td>
              <td className="py-2 px-2 text-text-muted">{t.exit_price ?? '—'}</td>
              <td className="py-2 px-2 text-red/60">{t.sl ?? '—'}</td>
              <td className="py-2 px-2 text-green/60">{t.tp ?? '—'}</td>
              <td className={clsx('py-2 px-2', t.profit !== null && t.profit >= 0 ? 'text-green' : 'text-red')}>
                {t.profit !== null ? (
                  <span className={clsx(
                    'inline-flex px-1.5 py-0.5 rounded text-[10px]',
                    t.profit >= 0 ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                  )}>
                    {t.profit >= 0 ? '+' : ''}{formatCurrency(t.profit)}
                  </span>
                ) : '—'}
              </td>
              <td className="py-2 px-2 text-text-dim">
                {formatDuration(t.open_time, t.close_time)}
              </td>
              <td className="py-2 px-2">
                <span className={clsx(
                  'inline-flex px-2 py-0.5 rounded text-[10px] font-semibold',
                  t.status === 'open'
                    ? 'bg-green/10 text-green'
                    : 'bg-blue/10 text-blue',
                )}>
                  {t.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
