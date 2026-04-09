'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, User, Compass } from 'lucide-react'
import { useRequireAuth } from '@/lib/hooks/useRequireAuth'
import { useMyProfile } from '@/lib/hooks/useAuth'
import { getAnimalEmoji } from '@/lib/utils/animalProfile'

// /gatherings/[id] 및 하위 경로(/apply, /apply/complete 등)에서 숨김
const HIDDEN_PATTERNS = [/^\/gatherings\/[^/]+/]

function isValidImageSrc(url: string): boolean {
  return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')
}

function MyTabIcon({ avatarUrl, animalType }: { avatarUrl?: string | null; animalType?: string | null }) {
  const validAvatarUrl = typeof avatarUrl === 'string' && avatarUrl.trim().length > 0 && isValidImageSrc(avatarUrl) ? avatarUrl : null
  if (validAvatarUrl) {
    return (
      <Image
        src={validAvatarUrl}
        alt="프로필"
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
    )
  }
  if (animalType) {
    return <span className="text-lg leading-none">{getAnimalEmoji(animalType)}</span>
  }
  return <User size={20} />
}

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, requireAuth } = useRequireAuth()
  const { data: profile } = useMyProfile()

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
                {isLoggedIn ? (
                  <MyTabIcon avatarUrl={profile?.avatarUrl} animalType={profile?.animalType} />
                ) : (
                  <Icon size={20} />
                )}
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
