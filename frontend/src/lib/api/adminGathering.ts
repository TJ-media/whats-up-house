import apiClient from './client'
import type { ApiResponse } from './types'

export interface AdminGatheringListItem {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  locationName: string | null
  price: number
  capacity: number
  currentApplicants: number
  applicantCount?: number   // 기존 admin.ts 호환
  status: string
  thumbnailUrl?: string | null
  moodTags?: string[] | null
  activityTags?: string[] | null
}

export interface GatheringCreateRequest {
  title: string
  description: string
  howToRun?: string[]
  locationId: string
  date: string
  startTime: string
  endTime: string
  price: number
  capacity: number
  thumbnailUrl?: string
  moodTags?: string[]
  activityTags?: string[]
  mileageReward?: number
}

export interface LocationItem {
  id: string
  name: string
  address: string
  maxCapacity: number
  features: string[] | null
  contractStatus: string
}

export interface AdminApplicationItem {
  id: string
  name: string
  phone: string | null
  gender: string | null
  age: number | null
  job: string | null
  mbti: string | null
  intro: string | null
  referralSource: string | null
  status: string
  createdAt: string
  isGuest: boolean
}

export const adminGatheringApi = {
  getAll: async (status?: string, date?: string): Promise<AdminGatheringListItem[]> => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (date) params.append('date', date)
    const query = params.toString()
    const res = await apiClient.get<ApiResponse<AdminGatheringListItem[]>>(
      `/api/admin/gatherings${query ? `?${query}` : ''}`
    )
    // currentApplicants 없으면 applicantCount로 fallback
    return (res.data.data ?? []).map((g) => ({
      ...g,
      currentApplicants: g.currentApplicants ?? g.applicantCount ?? 0,
    }))
  },

  create: async (data: GatheringCreateRequest) => {
    const res = await apiClient.post<ApiResponse<unknown>>('/api/admin/gatherings', data)
    return res.data.data
  },

  update: async (id: string, data: GatheringCreateRequest) => {
    const res = await apiClient.put<ApiResponse<unknown>>(`/api/admin/gatherings/${id}`, data)
    return res.data.data
  },

  updateStatus: async (id: string, status: string) => {
    await apiClient.patch(`/api/admin/gatherings/${id}/status`, { status })
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/admin/gatherings/${id}`)
  },

  getLocations: async (): Promise<LocationItem[]> => {
    const res = await apiClient.get<ApiResponse<LocationItem[]>>('/api/admin/locations')
    return res.data.data ?? []
  },

  createLocation: async (data: Partial<LocationItem>) => {
    const res = await apiClient.post<ApiResponse<unknown>>('/api/admin/locations', data)
    return res.data.data
  },

  updateLocation: async (id: string, data: Partial<LocationItem>) => {
    const res = await apiClient.put<ApiResponse<unknown>>(`/api/admin/locations/${id}`, data)
    return res.data.data
  },

  deleteLocation: async (id: string) => {
    await apiClient.delete(`/api/admin/locations/${id}`)
  },

  getApplications: async (gatheringId: string): Promise<AdminApplicationItem[]> => {
    const res = await apiClient.get<ApiResponse<AdminApplicationItem[]>>(
      `/api/admin/gatherings/${gatheringId}/applications`
    )
    return res.data.data ?? []
  },

  updateAttendance: async (applicationId: string, attended: boolean) => {
    const res = await apiClient.patch<ApiResponse<unknown>>(
      `/api/admin/applications/${applicationId}/attend`,
      { attended }
    )
    return res.data.data
  },

  deleteApplication: async (applicationId: string) => {
    await apiClient.delete(`/api/admin/applications/${applicationId}`)
  },
}
