import React from 'react'
import { cn } from '../../lib/cn'

const variantStyles = {
  default: 'bg-surface-subtle text-content border-border',
  accent: 'bg-accent-subtle text-accent border-accent-border',
  success: 'bg-success-subtle text-success border-success-border',
  warning: 'bg-warning-subtle text-warning border-warning-border',
  danger: 'bg-danger-subtle text-danger border-danger-border',
  brand: 'bg-brand-subtle text-brand border-brand-border',
} as const

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
} as const

export type BadgeVariant = keyof typeof variantStyles
export type BadgeSize = keyof typeof sizeStyles

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-xl border',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
