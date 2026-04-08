import apiClient from './client'
import type { ApiResponse, GatheringListItem, GatheringDetail } from './types'

// 날짜별 게더링 목록 조회
export const fetchGatherings = async (date: string): Promise<GatheringListItem[]> => {
  const response = await apiClient.get<ApiResponse<GatheringListItem[]>>('/api/gatherings', { params: { date } })
  return response.data.data
}

// 게더링 상세 조회
export const fetchGatheringDetail = async (id: string): Promise<GatheringDetail> => {
  const response = await apiClient.get<ApiResponse<GatheringDetail>>(`/api/gatherings/${id}`)
  return response.data.data
}

// 달력 dot 표시용 날짜 목록 조회
export const fetchCalendarDots = async (year: number, month: number): Promise<string[]> => {
  const response = await apiClient.get<ApiResponse<string[]>>('/api/gatherings/calendar', { params: { year, month } })
  return response.data.data
}
