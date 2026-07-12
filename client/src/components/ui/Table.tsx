import React from 'react'
import { cn } from '../../lib/cn'

export function Table({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border-subtle bg-surface-glass backdrop-blur shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'hidden sm:grid grid-cols-12 gap-0 px-6 py-3 bg-surface-muted text-xs font-semibold text-content-muted border-b border-border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('divide-y divide-border', className)} {...props}>
      {children}
    </div>
  )
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-0 px-4 sm:px-6 py-4 items-center transition-colors duration-150 hover:bg-surface-muted',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TableHead({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-content-muted', className)} {...props}>
      {children}
    </div>
  )
}

export function TableCell({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('min-w-0 text-sm text-content', className)} {...props}>
      {children}
    </div>
  )
}
