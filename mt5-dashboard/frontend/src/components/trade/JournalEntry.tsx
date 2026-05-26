'use client'
import { useState } from 'react'
import type { Trade } from '@/types'
import { tradesApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Save, X, Tag, BookOpen } from 'lucide-react'

interface Props {
  trade: Trade
  onClose: () => void
  onSaved: () => void
}

const STRATEGY_TAGS = ['Breakout', 'Trend Follow', 'Reversal', 'Scalp', 'News Play', 'Support/Resistance', 'ICT/SMC', 'Supply/Demand']

export default function JournalEntry({ trade, onClose, onSaved }: Props) {
  const [notes, setNotes] = useState(trade.journal_notes ?? '')
  const [tag, setTag] = useState(trade.strategy_tag ?? '')
  const [lessons, setLessons] = useState(trade.lessons ?? '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await tradesApi.updateJournal(trade.id, { journal_notes: notes, strategy_tag: tag, lessons })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-3 border border-border-2 rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-blue" />
            <span className="font-semibold text-sm">Journal — {trade.symbol}</span>
          </div>
          <button onClick={onClose} className="text-text-dim hover:text-text transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Trade summary */}
          <div className="flex gap-3 text-xs font-mono bg-bg-4 rounded-lg p-3">
            <span className={trade.type === 'BUY' ? 'text-green' : 'text-red'}>{trade.type}</span>
            <span className="text-text-muted">{trade.lots} lots @ {trade.entry_price}</span>
            {trade.profit !== null && (
              <span className={trade.profit >= 0 ? 'text-green ml-auto' : 'text-red ml-auto'}>
                {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
              </span>
            )}
          </div>

          {/* Strategy tag */}
          <div>
            <label className="text-[10px] font-semibold text-text-dim tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <Tag size={11} /> Strategy
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STRATEGY_TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setTag(tag === t ? '' : t)}
                  className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                    tag === t
                      ? 'bg-blue/20 border-blue text-blue'
                      : 'border-border text-text-dim hover:border-border-2 hover:text-text-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-semibold text-text-dim tracking-wider uppercase mb-2 block">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Trade setup, rationale, market context..."
              className="w-full bg-bg-4 border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-text-dim resize-none focus:outline-none focus:border-blue/50 transition-colors"
            />
          </div>

          {/* Lessons */}
          <div>
            <label className="text-[10px] font-semibold text-text-dim tracking-wider uppercase mb-2 block">Lessons Learned</label>
            <textarea
              value={lessons}
              onChange={e => setLessons(e.target.value)}
              rows={2}
              placeholder="What did this trade teach you?"
              className="w-full bg-bg-4 border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-text-dim resize-none focus:outline-none focus:border-blue/50 transition-colors"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue/20 hover:bg-blue/30 border border-blue/40 text-blue font-semibold text-xs py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? 'Saving...' : 'Save Journal Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
