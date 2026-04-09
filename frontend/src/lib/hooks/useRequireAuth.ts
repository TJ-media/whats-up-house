import { useAuthStore } from '@/lib/store/authStore'
import { useRouter, usePathname } from 'next/navigation'

export function useRequireAuth() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const requireAuth = (returnUrl?: string): boolean => {
    if (!isLoggedIn) {
      const target = returnUrl ?? pathname
      router.push(`/login?returnUrl=${encodeURIComponent(target)}`)
      return false
    }
    return true
  }

  return { isLoggedIn, requireAuth }
}
