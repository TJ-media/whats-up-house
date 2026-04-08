import { useQuery } from '@tanstack/react-query'
import { fetchGatherings, fetchCalendarDots } from '@/lib/api/gathering'

export function useGatherings(date: string) {
  return useQuery({
    queryKey: ['gatherings', date],
    queryFn: () => fetchGatherings(date),
  })
}

export function useCalendarDots(year: number, month: number) {
  return useQuery({
    queryKey: ['calendar', year, month],
    queryFn: () => fetchCalendarDots(year, month),
  })
}
