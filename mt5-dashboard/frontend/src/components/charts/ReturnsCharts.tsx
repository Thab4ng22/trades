'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import type { ChartPoint } from '@/types'

interface Props { data: ChartPoint[] }

const tooltipStyle = {
  contentStyle: { background: '#1e2330', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 },
  itemStyle: { color: '#e8eaf0', fontSize: 12, fontFamily: 'var(--font-dm-mono)' },
  labelStyle: { color: '#8892a4', fontSize: 11 },
}

export function WeekdayReturns({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fill: '#8892a4', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4d5566', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }} axisLine={false} tickLine={false} width={36} tickFormatter={v => '$' + v} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => ['$' + v.toLocaleString(), 'P/L']} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={28}>
          {data?.map((e, i) => (
            <Cell key={i} fill="rgba(59,130,246,0.5)" stroke="#3b82f6" strokeWidth={1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthlyReturns({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fill: '#8892a4', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4d5566', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }} axisLine={false} tickLine={false} width={32} tickFormatter={v => v + '%'} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(1) + '%', 'Return']} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={28}>
          {data?.map((e, i) => (
            <Cell
              key={i}
              fill={e.value >= 0 ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}
              stroke={e.value >= 0 ? '#10b981' : '#ef4444'}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
