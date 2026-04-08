type GatheringStatus = 'RECRUITING' | 'CLOSED' | 'COMPLETED' | 'CANCELLED'
type AttendanceStatus = 'ATTENDED' | 'PENDING'
type BadgeVariant = GatheringStatus | AttendanceStatus

interface BadgeProps {
  variant: BadgeVariant
}

const BADGE_CONFIG: Record<BadgeVariant, { label: string; className: string }> = {
  RECRUITING: { label: '모집중', className: 'bg-green-100 text-green-700' },
  CLOSED:     { label: '마감',   className: 'bg-gray-100 text-gray-500' },
  COMPLETED:  { label: '완료',   className: 'bg-blue-100 text-blue-700' },
  CANCELLED:  { label: '취소',   className: 'bg-red-100 text-red-500' },
  ATTENDED:   { label: '참석완료', className: 'bg-teal-100 text-teal-700' },
  PENDING:    { label: '대기중', className: 'bg-yellow-100 text-yellow-700' },
}

export default function Badge({ variant }: BadgeProps) {
  const { label, className } = BADGE_CONFIG[variant]
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
      {label}
    </span>
  )
}
