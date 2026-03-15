'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Zap, LayoutDashboard, History, BookOpen, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

const LINKS = [
  { href: '/dashboard', label: 'Analisar', icon: LayoutDashboard },
  { href: '/historico', label: 'Historico', icon: History },
  { href: '/scripts', label: 'Scripts', icon: BookOpen },
]

export default function NavBar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function sair() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Header topo */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">SellAI</span>
          </div>
          <button
            onClick={sair}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40 safe-area-pb">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const ativo = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 px-6 text-xs font-medium transition-colors',
                  ativo
                    ? 'text-brand-600'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Icon size={22} strokeWidth={ativo ? 2.5 : 1.75} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
