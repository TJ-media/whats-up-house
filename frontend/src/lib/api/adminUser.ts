import apiClient from './client'
import type { ApiResponse } from './types'

export interface AdminUserListItem {
  id: string
  nickname: string
  name: string | null
  phone: string | null
  email: string
  gender: string | null
  age: number | null
  job: string | null
  mbti: string | null
  createdAt: string
  applicationCount: number
  mileage: number
  accountStatus: string  // ACTIVE / SUSPENDED / ADMIN
}

export interface AdminUserDetail extends AdminUserListItem {
  bio: string | null
  animalType: string | null
  interests: string[] | null
  applicationHistory: AdminUserApplicationItem[]
}

export interface AdminUserApplicationItem {
  id: string
  gatheringTitle?: string
  status: string
  createdAt: string
  isGuest: boolean
}

export interface AdminUserPage {
  content: AdminUserListItem[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const adminUserApi = {
  getUsers: async (keyword?: string, page = 0, size = 10): Promise<AdminUserPage> => {
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    params.append('page', String(page))
    params.append('size', String(size))
    params.append('sort', 'createdAt,desc')
    const res = await apiClient.get<ApiResponse<AdminUserPage>>(`/api/admin/users?${params}`)
    return res.data.data
  },

  getUserDetail: async (id: string): Promise<AdminUserDetail> => {
    const res = await apiClient.get<ApiResponse<AdminUserDetail>>(`/api/admin/users/${id}`)
    return res.data.data
  },

  updateStatus: async (id: string, suspend: boolean): Promise<void> => {
    await apiClient.patch(`/api/admin/users/${id}/status?suspend=${suspend}`)
  },
}
