import LoadingSpinner from './LoadingSpinner'

type ButtonVariant = 'primary' | 'outlined' | 'ghost' | 'kakao'
type ButtonSize = 'sm' | 'default' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: React.ReactNode
}

const variantMap: Record<ButtonVariant, string> = {
  primary:  'bg-primary text-white hover:opacity-90',
  outlined: 'border border-primary text-primary bg-transparent hover:bg-primary-light',
  ghost:    'text-tag-text bg-transparent hover:bg-tag-bg',
  kakao:    'bg-[#FEE500] text-[#191919] hover:opacity-90',
}

const sizeMap: Record<ButtonSize, string> = {
  sm:      'px-4 py-2 text-sm min-h-[44px]',
  default: 'px-6 py-3 text-base min-h-[44px]',
  lg:      'px-8 py-4 text-lg min-h-[44px]',
}

export default function Button({
  variant = 'primary',
  size = 'default',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium rounded-button transition-colors
        disabled:opacity-50 disabled:pointer-events-none
        ${isLoading ? 'pointer-events-none opacity-70' : ''}
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className ?? ''}
      `}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : children}
    </button>
  )
}
