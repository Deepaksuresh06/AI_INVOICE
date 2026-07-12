/** Shared Framer Motion presets for consistent animations across the app. */

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
} as const

export const fadeInDown = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
} as const

export const scaleIn = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
} as const

export const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

export const easeOutTransition = {
  duration: 0.35,
  ease: 'easeOut' as const,
}

export const tapScale = { whileTap: { scale: 0.98 } }
export const hoverScale = { whileHover: { scale: 1.01 } }
