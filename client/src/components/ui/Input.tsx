import React from 'react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../theme/tokens'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-xl border bg-surface-elevated px-3 py-2 text-sm text-content',
          'placeholder:text-content-subtle',
          'transition-colors duration-200',
          focusRing,
          hasError ? 'border-danger' : 'border-border hover:border-border-strong',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
