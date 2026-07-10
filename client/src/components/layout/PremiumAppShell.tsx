import React, { useEffect, useMemo, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { LandingBackground } from '../LandingBackground'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function PremiumAppShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // localStorage/matchMedia are only available in browser; this app is client-rendered
    try {
      return getInitialTheme()
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const themeLabel = useMemo(() => (theme === 'dark' ? 'Dark' : 'Light'), [theme])

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#020617] transition-colors">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <LandingBackground />
      </div>

      <header className="relative z-10 flex items-center justify-end px-5 sm:px-6 py-3">
        <button
          type="button"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 transition"
          aria-label={`Switch theme (current: ${themeLabel})`}
        >
          <span className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
        </button>
      </header>

      <main className="relative z-10">
        {children}
      </main>

      <Toaster />
    </div>
  )
}


