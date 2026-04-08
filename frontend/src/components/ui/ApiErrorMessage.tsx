import { AlertCircle } from 'lucide-react'
import Button from './Button'

interface ApiErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export default function ApiErrorMessage({ message, onRetry }: ApiErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <AlertCircle size={32} className="text-primary" />
      <p className="text-sm text-tag-text">{message ?? '오류가 발생했습니다.'}</p>
      {onRetry && (
        <Button variant="outlined" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
