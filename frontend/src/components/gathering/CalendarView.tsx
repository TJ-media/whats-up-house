'use client'

import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarViewProps {
  year: number
  month: number
  selectedDate: string   // YYYY-MM-DD
  dotDates: string[]     // 게더링이 있는 날짜 목록
  onSelectDate: (date: string) => void
  onChangeMonth: (year: number, month: number) => void
}

export default function CalendarView({
  year, month, selectedDate, dotDates, onSelectDate, onChangeMonth,
}: CalendarViewProps) {
  const firstDay = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
  const startDayOfWeek = firstDay.day()
  const daysInMonth = firstDay.daysInMonth()
  const today = dayjs().format('YYYY-MM-DD')

  const cells: (number | null)[] = [
    ...Array(startDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const handlePrev = () => {
    const d = firstDay.subtract(1, 'month')
    onChangeMonth(d.year(), d.month() + 1)
  }
  const handleNext = () => {
    const d = firstDay.add(1, 'month')
    onChangeMonth(d.year(), d.month() + 1)
  }

  return (
    <div className="bg-card rounded-card p-4 mx-4">
      {/* 월 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrev} className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ChevronLeft size={20} className="text-tag-text" />
        </button>
        <span className="font-semibold text-foreground">{year}년 {month}월</span>
        <button onClick={handleNext} className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ChevronRight size={20} className="text-tag-text" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-primary' : 'text-tag-text'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-10" />

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === today
          const hasDot = dotDates.includes(dateStr)
          const isSunday = idx % 7 === 0

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className="flex flex-col items-center py-1 gap-0.5 min-h-[44px] justify-center"
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
                  ${isSelected ? 'bg-primary text-white font-semibold' : ''}
                  ${!isSelected && isToday ? 'text-primary font-semibold' : ''}
                  ${!isSelected && !isToday && isSunday ? 'text-primary' : ''}
                  ${!isSelected && !isToday && !isSunday ? 'text-foreground' : ''}
                `}
              >
                {day}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${hasDot ? (isSelected ? 'bg-white' : 'bg-primary') : 'bg-transparent'}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
