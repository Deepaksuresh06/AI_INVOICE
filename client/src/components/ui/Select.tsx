import React from 'react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../theme/tokens'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError = false, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border bg-surface-elevated px-3 py-2 text-sm text-content',
          'transition-colors duration-200',
          focusRing,
          hasError ? 'border-danger' : 'border-border hover:border-border-strong',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    )
  },
)

Select.displayName = 'Select'
