'use client'
import { useState, useEffect, useCallback } from 'react'
import { analyticsApi } from '@/lib/api'
import type { Metrics, Analytics } from '@/types'

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [m, a] = await Promise.all([
        analyticsApi.metrics(),
        analyticsApi.charts(),
      ])
      setMetrics(m)
      setAnalytics(a)
    } catch (_) {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    refresh()
    const iv = setInterval(refresh, 20000)
    return () => clearInterval(iv)
  }, [refresh])

  return { metrics, analytics, loading, refresh }
}
