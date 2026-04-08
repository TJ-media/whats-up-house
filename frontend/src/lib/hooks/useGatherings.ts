import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchGatherings, fetchCalendarDots, fetchGatheringDetail, submitGuestApplication, submitUserApplication } from '@/lib/api/gathering'
import type { GuestApplicationRequest, UserApplicationRequest } from '@/lib/api/types'

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

export function useGatheringDetail(id: string) {
  return useQuery({
    queryKey: ['gathering', id],
    queryFn: () => fetchGatheringDetail(id),
    enabled: !!id,
  })
}

export function useSubmitGuestApplication() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GuestApplicationRequest }) =>
      submitGuestApplication(id, data),
  })
}

export function useSubmitUserApplication() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserApplicationRequest }) =>
      submitUserApplication(id, data),
  })
}
