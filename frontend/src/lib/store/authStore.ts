import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  userId: string | null
  nickname: string | null
  isAdmin: boolean
  isLoggedIn: boolean
  login: (token: string, userId: string, nickname: string, isAdmin: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      nickname: null,
      isAdmin: false,
      isLoggedIn: false,
      login: (token, userId, nickname, isAdmin) =>
        set({ accessToken: token, userId, nickname, isAdmin, isLoggedIn: true }),
      logout: () =>
        set({
          accessToken: null,
          userId: null,
          nickname: null,
          isAdmin: false,
          isLoggedIn: false,
        }),
    }),
    { name: 'auth-storage' }
  )
)
