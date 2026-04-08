import apiClient from './client'
import type { ApiResponse } from './types'

export type AdminGatheringStatus = 'RECRUITING' | 'CLOSED' | 'COMPLETED' | 'CANCELLED'

export interface AdminGathering {
  id: string
  title: string
  date: string           // YYYY-MM-DD
  startTime: string      // HH:mm:ss
  endTime: string
  locationName: string | null
  price: number
  capacity: number
  applicantCount: number
  status: AdminGatheringStatus
  thumbnailUrl: string | null
  moodTags: string[] | null
  activityTags: string[] | null
}

// 관리자 게더링 목록 조회
export const fetchAdminGatherings = async (): Promise<AdminGathering[]> => {
  const response = await apiClient.get<ApiResponse<AdminGathering[]>>('/api/admin/gatherings')
  return response.data.data ?? []
}
