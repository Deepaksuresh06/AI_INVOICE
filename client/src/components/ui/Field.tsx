import React from 'react'
import { cn } from '../../lib/cn'

export type FieldProps = {
  label: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, required, error, hint, className, children }: FieldProps) {
  const fieldId = React.useId()

  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={fieldId} className="text-xs font-semibold text-content-muted">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      <div className="mt-1">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id: fieldId })
          : children}
      </div>
      {hint && !error ? <p className="mt-1 text-xs text-content-subtle">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-danger font-semibold">{error}</p> : null}
    </div>
  )
}
