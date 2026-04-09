'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  LayoutDashboard, CalendarDays, MapPin, Users, LogOut, ClipboardList,
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { useHydration } from '@/lib/hooks/useHydration'

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: '대시보드', exact: true },
  { href: '/admin/gatherings', icon: CalendarDays, label: '게더링 관리' },
  { href: '/admin/applications', icon: ClipboardList, label: '참가자 관리' },
  { href: '/admin/locations', icon: MapPin, label: '장소 관리' },
  { href: '/admin/users', icon: Users, label: '회원 관리' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const hydrated = useHydration()
  const { isLoggedIn, isAdmin, nickname, logout } = useAuthStore()

  // hydration 완료 후 비관리자 접근 차단
  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) router.replace('/login?returnUrl=/admin')
    else if (!isAdmin) router.replace('/')
  }, [hydrated, isLoggedIn, isAdmin, router])

  if (!hydrated || !isLoggedIn || !isAdmin) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-[#F8F5F2]">
      {/* 사이드바 */}
      <aside className="w-60 bg-[#1A1A1A] flex flex-col min-h-screen shrink-0">
        {/* 로고 */}
        <div className="px-5 py-6 border-b border-white/10">
          <h1 className="text-sm font-bold text-white/60 uppercase tracking-widest">The Curator&apos;s</h1>
          <h2 className="text-lg font-bold text-primary">House</h2>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-input text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 하단 프로필 + 로그아웃 */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">
                {nickname ? nickname[0] : 'A'}
              </span>
            </div>
            <span className="text-sm text-white/80 font-medium">{nickname ?? '관리자'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-input text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 콘텐츠 */}
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  )
}
