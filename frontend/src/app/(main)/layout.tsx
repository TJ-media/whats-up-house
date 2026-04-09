import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mobile-layout flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  )
}
