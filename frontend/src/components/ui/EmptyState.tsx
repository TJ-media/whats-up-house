import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Icon size={48} className="text-tag-text opacity-50" />
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-tag-text">{description}</p>
      )}
    </div>
  )
}
