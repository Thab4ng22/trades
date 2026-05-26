'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  wins: number
  losses: number
}

export default function WinLossDonut({ wins, losses }: Props) {
  const data = [
    { name: 'Win', value: wins },
    { name: 'Loss', value: losses },
  ]
  const total = wins + losses
  const winPct = total > 0 ? ((wins / total) * 100).toFixed(1) : '0'

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={130}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={58}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="#10b981" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1e2330', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}
            itemStyle={{ color: '#e8eaf0', fontSize: 12, fontFamily: 'var(--font-dm-mono)' }}
            labelStyle={{ display: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-lg text-text font-medium">{winPct}%</span>
        <span className="text-[10px] text-text-dim">win rate</span>
      </div>
    </div>
  )
}
