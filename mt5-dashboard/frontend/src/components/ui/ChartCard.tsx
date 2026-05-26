interface Props {
  title: string
  badge?: string
  children: React.ReactNode
  className?: string
}

export default function ChartCard({ title, badge, children, className }: Props) {
  return (
    <div className={`bg-bg-3 border border-border rounded-card p-4 ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-semibold tracking-[0.1em] text-text-muted uppercase">
          {title}
        </h3>
        {badge && (
          <span className="text-[10px] font-mono text-text-dim bg-bg-4 px-2 py-0.5 rounded border border-border">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
