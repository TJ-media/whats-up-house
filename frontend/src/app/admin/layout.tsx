'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CalendarDays, Settings } from 'lucide-react'

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
  { href: '/admin/gatherings', icon: CalendarDays, label: '게더링 관리' },
  { href: '/admin/users', icon: Users, label: '유저 관리' },
  { href: '/admin/settings', icon: Settings, label: '설정' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="admin-layout flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-60 bg-card border-r border-tag-bg p-4">
        <h2 className="text-lg font-bold text-primary mb-6">관리자</h2>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-input text-sm ${
                  isActive
                    ? 'bg-primary-light text-primary font-semibold'
                    : 'text-tag-text hover:bg-tag-bg'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
