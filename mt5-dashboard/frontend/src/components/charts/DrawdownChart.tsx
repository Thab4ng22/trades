'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartPoint } from '@/types'

interface Props { data: ChartPoint[] }

export default function DrawdownChart({ data }: Props) {
  if (!data?.length) return <div className="h-36 flex items-center justify-center text-text-dim text-xs">No data</div>

  // Compute running drawdown from equity curve
  let peak = data[0]?.value ?? 0
  const ddData = data.map(pt => {
    if (pt.value > peak) peak = pt.value
    const dd = peak > 0 ? ((peak - pt.value) / peak) * 100 : 0
    return { label: pt.label, value: -Number(dd.toFixed(2)) }
  })

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={ddData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" hide />
        <YAxis
          tick={{ fill: '#4d5566', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
          axisLine={false} tickLine={false} width={36}
          tickFormatter={v => v + '%'}
        />
        <Tooltip
          contentStyle={{ background: '#1e2330', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}
          itemStyle={{ color: '#ef4444', fontSize: 12, fontFamily: 'var(--font-dm-mono)' }}
          formatter={(v: number) => [v.toFixed(2) + '%', 'Drawdown']}
          labelStyle={{ color: '#8892a4', fontSize: 11 }}
        />
        <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1.5} fill="url(#ddGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
