'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import { Bell, Coffee } from 'lucide-react'
import ViewToggle from '@/components/gathering/ViewToggle'
import CalendarView from '@/components/gathering/CalendarView'
import MapView from '@/components/gathering/MapView'
import GatheringCard from '@/components/gathering/GatheringCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ApiErrorMessage from '@/components/ui/ApiErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import { useGatherings, useCalendarDots } from '@/lib/hooks/useGatherings'

type View = 'calendar' | 'map'

export default function MainHomePage() {
  const today = dayjs()
  const [view, setView] = useState<View>('calendar')
  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'))
  const [currentYear, setCurrentYear] = useState(today.year())
  const [currentMonth, setCurrentMonth] = useState(today.month() + 1)

  const { data: gatherings, isLoading, isError, refetch } = useGatherings(selectedDate)
  const { data: calendarDots = [] } = useCalendarDots(currentYear, currentMonth)

  const handleChangeMonth = (year: number, month: number) => {
    setCurrentYear(year)
    setCurrentMonth(month)
  }

  const selectedDayjs = dayjs(selectedDate)
  const sectionTitle = `${selectedDayjs.month() + 1}월 ${selectedDayjs.date()}일 열리는 게더링`

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="text-lg font-bold text-foreground">와썹하우스</h1>
        <button className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Bell size={22} className="text-foreground" />
        </button>
      </header>

      {/* 뷰 토글 */}
      <div className="mb-4">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === 'calendar' ? (
        <>
          {/* 달력 */}
          <div className="mb-5">
            <CalendarView
              year={currentYear}
              month={currentMonth}
              selectedDate={selectedDate}
              dotDates={calendarDots}
              onSelectDate={setSelectedDate}
              onChangeMonth={handleChangeMonth}
            />
          </div>

          {/* 게더링 목록 */}
          <div className="px-4">
            <h2 className="text-base font-semibold text-foreground mb-3">{sectionTitle}</h2>

            {isLoading && (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            )}

            {isError && (
              <ApiErrorMessage onRetry={() => { refetch() }} />
            )}

            {!isLoading && !isError && gatherings?.length === 0 && (
              <div className="border border-dashed border-tag-bg rounded-card">
                <EmptyState
                  icon={Coffee}
                  title="이 날은 게더링이 없어요."
                  description="다른 날을 골라보세요 :)"
                />
              </div>
            )}

            {!isLoading && !isError && gatherings && gatherings.length > 0 && (
              <div className="flex flex-col gap-4">
                {gatherings.map((gathering) => (
                  <GatheringCard key={gathering.id} gathering={gathering} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <MapView
          gatherings={gatherings ?? []}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => { refetch() }}
        />
      )}
    </div>
  )
}
