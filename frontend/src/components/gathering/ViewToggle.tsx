type View = 'calendar' | 'map'

interface ViewToggleProps {
  view: View
  onChange: (view: View) => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-tag-bg rounded-full p-1 mx-4">
      <button
        onClick={() => onChange('calendar')}
        className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
          view === 'calendar' ? 'bg-primary text-white' : 'text-tag-text'
        }`}
      >
        달력으로 보기
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
          view === 'map' ? 'bg-primary text-white' : 'text-tag-text'
        }`}
      >
        지도로 보기
      </button>
    </div>
  )
}
