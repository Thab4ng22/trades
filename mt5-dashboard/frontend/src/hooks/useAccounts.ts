'use client'
import { useState, useEffect, useCallback } from 'react'
import { accountsApi } from '@/lib/api'
import type { Account, MT5Summary } from '@/types'

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [summary, setSummary] = useState<MT5Summary | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [accts, sum] = await Promise.all([
        accountsApi.list(),
        accountsApi.summary(),
      ])
      setAccounts(accts)
      setSummary(sum)
    } catch (_) {
      // backend may not be running in dev
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const iv = setInterval(refresh, 20000)
    return () => clearInterval(iv)
  }, [refresh])

  const activate = async (id: number) => {
    const sum = await accountsApi.activate(id)
    setSummary(sum)
    const accts = await accountsApi.list()
    setAccounts(accts)
  }

  return { accounts, summary, loading, refresh, activate }
}
