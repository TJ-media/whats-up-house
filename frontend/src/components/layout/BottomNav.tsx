'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, User, Compass } from 'lucide-react'
import { useRequireAuth } from '@/lib/hooks/useRequireAuth'

// /gatherings/[id] 및 하위 경로(/apply, /apply/complete 등)에서 숨김
// /gatherings 목록 페이지는 표시 유지
const HIDDEN_PATTERNS = [/^\/gatherings\/[^/]+/]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { requireAuth } = useRequireAuth()

  if (HIDDEN_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return null
  }

  const navItems = [
    { href: '/', icon: Home, label: '홈', requireLogin: false },
    { href: '/gatherings', icon: Compass, label: '게더링', requireLogin: false },
    { href: '/social', icon: Users, label: '소셜', requireLogin: false },
    { href: '/mypage', icon: User, label: '마이', requireLogin: true },
  ]

  return (
    <nav className="sticky bottom-0 bg-card border-t border-tag-bg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          if (item.requireLogin) {
            return (
              <button
                key={item.href}
                onClick={() => {
                  if (requireAuth(item.href)) router.push(item.href)
                }}
                className={`flex flex-col items-center gap-1 text-xs ${
                  isActive ? 'text-primary' : 'text-tag-text'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs ${
                isActive ? 'text-primary' : 'text-tag-text'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
