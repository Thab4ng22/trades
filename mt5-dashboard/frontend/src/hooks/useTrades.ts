'use client'
import { useState, useEffect, useCallback } from 'react'
import { tradesApi } from '@/lib/api'
import type { Trade } from '@/types'

export function useTrades(status?: string) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await tradesApi.list(status)
      setTrades(data)
    } catch (_) {}
    finally { setLoading(false) }
  }, [status])

  useEffect(() => {
    refresh()
    const iv = setInterval(refresh, 15000)
    return () => clearInterval(iv)
  }, [refresh])

  return { trades, loading, refresh }
}
