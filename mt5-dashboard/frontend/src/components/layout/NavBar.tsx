'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/trades', label: 'Trades' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/journal', label: 'Journal' },
  { href: '/settings', label: 'Settings' },
]

export default function NavBar() {
  const path = usePathname()
  return (
    <nav className="bg-bg-2 border-b border-border flex px-5 shrink-0">
      {LINKS.map(link => {
        const active = path === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all border-b-2
              ${active
                ? 'text-blue border-blue'
                : 'text-text-dim border-transparent hover:text-text-muted'
              }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
