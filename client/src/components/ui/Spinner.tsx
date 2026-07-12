import React from 'react'
import { cn } from '../../lib/cn'

const sizeStyles = {
  sm: 'h-4 w-4 border-[1.5px]',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-2',
} as const

export type SpinnerSize = keyof typeof sizeStyles

export type SpinnerProps = {
  size?: SpinnerSize
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizeStyles[size],
        className,
      )}
    />
  )
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded bg-surface-subtle animate-pulse', className)}
      aria-hidden="true"
      {...props}
    />
  )
}
