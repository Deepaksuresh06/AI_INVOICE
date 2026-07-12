import React from 'react'
import { cn } from '../../lib/cn'
import { shadows } from '../../theme/tokens'

const variantStyles = {
  default: 'bg-surface-elevated border-border shadow-sm',
  elevated: 'bg-surface-elevated border-border-subtle shadow-card',
  glass: 'bg-surface-glass border-border-subtle backdrop-blur shadow-glass',
  muted: 'bg-surface-muted border-border',
} as const

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
} as const

export type CardVariant = keyof typeof variantStyles
export type CardPadding = keyof typeof paddingStyles

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && ['hover:shadow-md', shadows.md],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-xl font-bold text-content', className)} {...props}>
      {children}
    </h2>
  )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-content-muted mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 flex items-center justify-between gap-3 border-t border-border pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
