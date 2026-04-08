interface TagProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export default function Tag({ label, selected = false, onClick }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
        selected
          ? 'bg-primary text-white'
          : 'bg-tag-bg text-tag-text hover:opacity-80'
      }`}
    >
      {label}
    </button>
  )
}
