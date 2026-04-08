import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-input border bg-card text-foreground
            placeholder:text-tag-text
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? 'border-primary' : 'border-tag-bg'}
            ${className ?? ''}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-primary">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
