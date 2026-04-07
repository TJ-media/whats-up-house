import apiClient from './client'
import type { ApiResponse, LoginResponse } from './types'

// 로그인
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', {
    email,
    password,
  })
  return response.data.data
}

// 로그아웃
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout')
}
