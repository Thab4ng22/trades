export function formatCurrency(val: number, decimals = 2): string {
  const abs = Math.abs(val)
  const str = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return (val < 0 ? '-' : '') + '$' + str
}

export function formatPercent(val: number, decimals = 1): string {
  return (val >= 0 ? '+' : '') + val.toFixed(decimals) + '%'
}

export function formatDuration(openTime: string, closeTime?: string | null): string {
  const start = new Date(openTime).getTime()
  const end = closeTime ? new Date(closeTime).getTime() : Date.now()
  const diff = Math.floor((end - start) / 1000)
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function pnlClass(val: number | null): string {
  if (val === null) return 'text-text-dim'
  return val >= 0 ? 'text-green' : 'text-red'
}
