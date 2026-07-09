import React from 'react'
import { Toaster } from 'react-hot-toast'
import { LandingBackground } from '../LandingBackground'

export default function PremiumAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#020617]">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <LandingBackground />
      </div>

      <main className="relative z-10">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

