interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-card bg-card shadow-sm ${className ?? ''}`}>
      {children}
    </div>
  )
}
