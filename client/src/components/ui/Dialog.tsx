import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { fadeIn, scaleIn } from '../../theme/motion'

export function DialogOverlay({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('absolute inset-0 bg-overlay backdrop-blur-sm', className)}
      onClick={onClick}
      aria-hidden="true"
      {...props}
    />
  )
}

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const

export function DialogContent({
  className,
  size = 'lg',
  children,
}: DialogContentProps) {
  return (
    <motion.div
      className={cn(
        'relative w-full bg-surface-elevated rounded-3xl shadow-elevated border border-border overflow-hidden',
        sizeStyles[size],
        className,
      )}
      initial={scaleIn.initial}
      animate={scaleIn.animate}
      exit={scaleIn.exit}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function Dialog({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
}) {
  if (!open) return null

  return (
    <motion.div
      className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      exit={fadeIn.exit}
      role="dialog"
      aria-modal="true"
    >
      {onClose && <DialogOverlay onClick={onClose} />}
      {children}
    </motion.div>
  )
}

export function DialogHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-2xl font-bold text-content truncate', className)} {...props}>
      {children}
    </h3>
  )
}

export function DialogDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-content-muted mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function DialogBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 sm:p-6 overflow-y-auto max-h-[70vh]', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 border-t border-border flex items-center justify-between gap-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
