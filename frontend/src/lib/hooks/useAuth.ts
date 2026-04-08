'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { login, register, checkNickname } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import type { RegisterRequest } from '@/lib/api/types'

export function useLogin() {
  const { login: storeLogin } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      storeLogin(data.accessToken, data.user.id, data.user.nickname, data.user.admin)
      if (data.user.admin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  })
}

export function useCheckNickname(nickname: string) {
  return useQuery({
    queryKey: ['nickname-check', nickname],
    queryFn: () => checkNickname(nickname),
    enabled: nickname.length >= 2,
    staleTime: 1000 * 10, // 10초
  })
}
