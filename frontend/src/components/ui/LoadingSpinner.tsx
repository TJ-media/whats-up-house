const sizeMap = {
  sm: 'w-4 h-4 border-2',
  default: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'default', className }: LoadingSpinnerProps) {
  return (
    <div
      className={`rounded-full border-tag-bg border-t-primary animate-spin ${sizeMap[size]} ${className ?? ''}`}
      role="status"
      aria-label="로딩 중"
    />
  )
}
