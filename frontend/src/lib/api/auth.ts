import apiClient from './client'
import type { ApiResponse, LoginResponse, RegisterRequest, NicknameCheckResponse } from './types'

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

// 회원가입
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/register', data)
  return response.data.data
}

// 닉네임 중복 확인
export const checkNickname = async (nickname: string): Promise<NicknameCheckResponse> => {
  const response = await apiClient.get<ApiResponse<NicknameCheckResponse>>(
    `/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`
  )
  return response.data.data
}
