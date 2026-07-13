import React, { useMemo } from 'react';
import { focusRing } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { cn } from '../../lib/cn';
import { useLocation } from "react-router-dom";

export default function PremiumAppShell({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme()
  const themeLabel = useMemo(() => (isDark ? 'Dark' : 'Light'), [isDark])

  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <div className="relative min-h-screen bg-surface text-content transition-theme">

      {/* Premium Sticky Navbar */}
      {!hideNavbar &&(
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
          <div
            className={cn(
              'rounded-2xl border border-border-subtle bg-surface-glass backdrop-blur shadow-glass',
            )}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3">
              {/* Left brand */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand shadow-lg">
                  <span className="text-sm font-black text-white">IQ</span>
                </div>

                <div className="min-w-0">
                  <h1 className="text-lg font-black tracking-tight text-content">
                    InvoiceIQ
                  </h1>
                </div>
              </div>

              {/* Right theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch theme (currently ${themeLabel})`}
                className={cn(
                  'group relative inline-flex items-center gap-2 rounded-xl',
                  'border border-border bg-surface-glass p-2',
                  'text-sm font-semibold text-content shadow-sm',
                  'transition-all duration-200 hover:-translate-y-px',
                  focusRing,
                )}
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <span className={cn('transition-all duration-300', isDark ? 'opacity-80' : 'opacity-100')}>
                    {isDark ? '🌙' : '☀️'}
                  </span>
                </span>

                {/* Animated thumb */}
                <span
                  className="relative z-10 h-6 w-12 rounded-full bg-surface-subtle overflow-hidden"
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      'absolute top-0 left-0 h-full w-1/2 rounded-full transition-transform duration-300 ease-out',
                      isDark ? 'translate-x-full' : 'translate-x-0',
                    )}
                    style={{
                      background:
                        'linear-gradient(to bottom right, rgba(99,102,241,0.25), rgba(34,211,238,0.25))',
                    }}
                  />

                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm transition-transform duration-300 ease-out bg-gradient-brand',
                      isDark ? 'translate-x-6' : 'translate-x-0',
                    )}
                  />
                </span>

                <span
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-start/15 to-brand-end/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </header>)}

      <main className="relative z-10 pt-4 sm:pt-6">{children}</main>
    </div>
  )
}
