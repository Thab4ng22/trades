'use client'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import NavBar from '@/components/layout/NavBar'
import { useAccounts } from '@/hooks/useAccounts'
import { accountsApi } from '@/lib/api'
import { Plus, Trash2, Server } from 'lucide-react'

export default function SettingsPage() {
  const { accounts, summary, activate, refresh } = useAccounts()
  const [form, setForm] = useState({ label: '', login: '', server: '', password: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const addAccount = async () => {
    if (!form.label || !form.login || !form.server || !form.password) return
    setAdding(true)
    await accountsApi.create(form)
    setForm({ label: '', login: '', server: '', password: '' })
    setShowForm(false)
    await refresh()
    setAdding(false)
  }

  const deleteAccount = async (id: number) => {
    if (!confirm('Delete this account?')) return
    await accountsApi.delete(id)
    await refresh()
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <TopBar accounts={accounts} summary={summary} onActivate={activate} onRefresh={refresh} />
      <NavBar />
      <main className="flex-1 p-5 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-text-muted">MT5 Accounts</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-blue/40 text-blue bg-blue/10 hover:bg-blue/20 transition-all"
          >
            <Plus size={13} /> Add Account
          </button>
        </div>

        {showForm && (
          <div className="bg-bg-3 border border-border rounded-card p-4 mb-4 space-y-3">
            <h3 className="text-xs font-semibold text-text-muted tracking-wider uppercase">New Account</h3>
            {[
              { key: 'label', placeholder: 'Account Label (e.g. Alpha Fund)' },
              { key: 'login', placeholder: 'MT5 Login Number' },
              { key: 'server', placeholder: 'Broker Server (e.g. ICMarkets-Live)' },
              { key: 'password', placeholder: 'MT5 Password', type: 'password' },
            ].map(f => (
              <input
                key={f.key}
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full bg-bg-4 border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-dim focus:outline-none focus:border-blue/50 transition-colors"
              />
            ))}
            <button
              onClick={addAccount}
              disabled={adding}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-blue/20 border border-blue/40 text-blue hover:bg-blue/30 transition-all disabled:opacity-50"
            >
              {adding ? 'Connecting...' : 'Save & Connect'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {accounts.map(acct => (
            <div
              key={acct.id}
              className={`bg-bg-3 border rounded-card p-4 flex items-center gap-3 ${
                acct.is_active ? 'border-blue/30' : 'border-border'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                acct.is_active ? 'bg-blue/20' : 'bg-bg-4'
              }`}>
                <Server size={14} className={acct.is_active ? 'text-blue' : 'text-text-dim'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{acct.label}</p>
                <p className="text-xs font-mono text-text-dim truncate">{acct.login} · {acct.server}</p>
              </div>
              {acct.is_active && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green/10 text-green border border-green/20">
                  ACTIVE
                </span>
              )}
              {!acct.is_active && (
                <button
                  onClick={() => activate(acct.id)}
                  className="text-xs px-3 py-1 rounded border border-border text-text-dim hover:border-blue hover:text-blue transition-all"
                >
                  Connect
                </button>
              )}
              <button
                onClick={() => deleteAccount(acct.id)}
                className="text-text-dim hover:text-red transition-colors ml-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
