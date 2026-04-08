import { useQuery } from '@tanstack/react-query'
import { fetchAdminGatherings } from '@/lib/api/admin'

export function useAdminGatherings() {
  return useQuery({
    queryKey: ['admin', 'gatherings'],
    queryFn: fetchAdminGatherings,
    refetchInterval: 1000 * 30, // 30초 자동 갱신
  })
}
