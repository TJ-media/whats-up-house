'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, User, Compass } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/gatherings', icon: Compass, label: '게더링' },
  { href: '/social', icon: Users, label: '소셜' },
  { href: '/mypage', icon: User, label: '마이' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky bottom-0 bg-card border-t border-tag-bg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon

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
