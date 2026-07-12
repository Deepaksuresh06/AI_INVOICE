/** InvoiceIQ design tokens — single source of truth for programmatic access. */

export const brand = {
  name: 'InvoiceIQ',
  tagline: 'Premium invoice extraction',
  gradient: 'from-brand-start to-brand-end',
  gradientText: 'bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent',
} as const

export const radii = {
  sm: 'rounded-lg',      // 8px
  md: 'rounded-xl',      // 12px
  lg: 'rounded-2xl',     // 16px
  xl: 'rounded-3xl',     // 24px
  full: 'rounded-full',
} as const

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  card: 'shadow-card',
  glass: 'shadow-glass',
  elevated: 'shadow-elevated',
} as const

export const transitions = {
  fast: 'duration-150',
  base: 'duration-200',
  slow: 'duration-300',
  theme: 'transition-theme',
} as const

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface'

export const hoverLift = 'hover:-translate-y-px transition-transform'
