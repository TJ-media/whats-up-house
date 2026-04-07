import apiClient from './client'
import type { ApiResponse, GatheringListItem, GatheringDetail } from './types'

// 게더링 목록 조회
export const fetchGatherings = async (): Promise<GatheringListItem[]> => {
  const response = await apiClient.get<ApiResponse<GatheringListItem[]>>('/api/gatherings')
  return response.data.data
}

// 게더링 상세 조회
export const fetchGatheringDetail = async (id: string): Promise<GatheringDetail> => {
  const response = await apiClient.get<ApiResponse<GatheringDetail>>(`/api/gatherings/${id}`)
  return response.data.data
}
