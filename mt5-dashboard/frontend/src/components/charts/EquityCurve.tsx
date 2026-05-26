'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface Props {
  data: ChartPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-4 border border-border rounded-md px-3 py-2">
      <p className="text-[10px] text-text-dim font-mono mb-1">{label}</p>
      <p className="text-sm font-mono text-text">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function EquityCurve({ data }: Props) {
  if (!data?.length) return <div className="h-40 flex items-center justify-center text-text-dim text-xs">No data</div>

  const vals = data.map(d => d.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const pad = (max - min) * 0.1

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" hide />
        <YAxis
          domain={[min - pad, max + pad]}
          tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'}
          width={42}
          tick={{ fill: '#4d5566', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={1.5}
          fill="url(#eqGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
