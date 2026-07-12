import React from 'react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../theme/tokens'
import { Spinner } from './Spinner'

const variantStyles = {
  primary:
    'bg-primary text-primary-fg shadow-sm hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled disabled:text-primary-disabled-fg',
  secondary:
    'bg-surface-elevated text-content border border-border shadow-sm hover:bg-surface-muted active:bg-surface-subtle disabled:opacity-50',
  ghost:
    'bg-transparent text-content-muted hover:bg-surface-muted hover:text-content active:bg-surface-subtle disabled:opacity-50',
  danger:
    'bg-danger-subtle text-danger border border-danger-border hover:bg-danger-subtle-hover active:bg-danger-subtle disabled:opacity-50',
  brand:
    'bg-gradient-to-r from-brand-start to-brand-end text-white shadow-brand hover:opacity-90 active:opacity-95 disabled:opacity-50',
} as const

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
} as const

export type ButtonVariant = keyof typeof variantStyles
export type ButtonSize = keyof typeof sizeStyles

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
          'disabled:cursor-not-allowed',
          focusRing,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && <Spinner size="sm" className="text-current" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
