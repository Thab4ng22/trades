import { clsx } from 'clsx'

interface Props {
  label: string
  value: string
  sub?: string
  subPositive?: boolean
  subNegative?: boolean
  highlight?: boolean
  className?: string
}

export default function MetricCard({
  label, value, sub, subPositive, subNegative, highlight, className
}: Props) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-bg-3 border border-border rounded-card p-4',
        highlight && 'border-blue/30',
        className,
      )}
    >
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue to-transparent" />
      )}
      <p className="text-[10px] font-semibold tracking-[0.1em] text-text-dim uppercase mb-2">
        {label}
      </p>
      <p className={clsx('font-mono text-xl tracking-tight', {
        'text-green': value.startsWith('+'),
        'text-red': value.startsWith('-$') || value.startsWith('−'),
        'text-text': !value.startsWith('+') && !value.startsWith('-'),
      })}>
        {value}
      </p>
      {sub && (
        <p className={clsx('text-[10px] font-mono mt-1', {
          'text-green': subPositive,
          'text-red': subNegative,
          'text-text-dim': !subPositive && !subNegative,
        })}>
          {sub}
        </p>
      )}
    </div>
  )
}
