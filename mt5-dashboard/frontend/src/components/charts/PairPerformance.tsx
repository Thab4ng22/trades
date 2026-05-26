'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import type { ChartPoint } from '@/types'

interface Props { data: ChartPoint[] }

export default function PairPerformance({ data }: Props) {
  if (!data?.length) return <div className="h-36 flex items-center justify-center text-text-dim text-xs">No data</div>
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
        <XAxis
          type="number"
          tick={{ fill: '#4d5566', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => '$' + v}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={54}
          tick={{ fill: '#8892a4', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#1e2330', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}
          itemStyle={{ color: '#e8eaf0', fontSize: 12, fontFamily: 'var(--font-dm-mono)' }}
          formatter={(v: number) => ['$' + v.toLocaleString(), 'P/L']}
          labelStyle={{ color: '#8892a4', fontSize: 11 }}
        />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={14}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.value >= 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)'}
              stroke={entry.value >= 0 ? '#10b981' : '#ef4444'}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
