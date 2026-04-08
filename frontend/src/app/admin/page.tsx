'use client'

import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Users, CalendarDays, TrendingUp, LayoutDashboard, RefreshCw } from 'lucide-react'
import { useAdminGatherings } from '@/lib/hooks/useAdminDashboard'
import { useAuthStore } from '@/lib/store/authStore'
import { Badge, LoadingSpinner, ApiErrorMessage } from '@/components/ui'
import type { AdminGatheringStatus } from '@/lib/api/admin'

dayjs.extend(isoWeek)

export default function AdminDashboardPage() {
  const { nickname } = useAuthStore()
  const { data: gatherings = [], isLoading, isError, refetch, dataUpdatedAt } = useAdminGatherings()

  const today = dayjs()
  const startOfWeek = today.startOf('isoWeek')
  const endOfWeek = today.endOf('isoWeek')

  // KPI 파생
  const weeklyGatherings = gatherings.filter((g) => {
    const d = dayjs(g.date)
    return d.isAfter(startOfWeek.subtract(1, 'day')) && d.isBefore(endOfWeek.add(1, 'day'))
  })
  const weeklyApplications = weeklyGatherings.reduce((sum, g) => sum + g.applicantCount, 0)
  const totalRevenue = weeklyGatherings.reduce((sum, g) => sum + (g.price ?? 0) * g.applicantCount, 0)
  const recruitingCount = gatherings.filter((g) => g.status === 'RECRUITING').length

  const updatedTime = dataUpdatedAt ? dayjs(dataUpdatedAt).format('HH:mm:ss') : '-'

  return (
    <div className="max-w-[1280px]">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            안녕하세요, {nickname ?? '대표'}님 👋
          </h1>
          <p className="text-sm text-tag-text">게더링을 잘 관리하고 있습니다</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{today.format('YYYY년 M월 D일 dddd')}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 text-xs text-tag-text mt-1 hover:text-primary transition-colors ml-auto"
          >
            <RefreshCw size={11} />
            <span>마지막 갱신: {updatedTime}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {isError && (
        <ApiErrorMessage
          message="데이터를 불러올 수 없습니다. 관리자 계정으로 로그인되어 있는지 확인해주세요."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <>
          {/* KPI 카드 */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <KpiCard
              icon={<CalendarDays size={22} className="text-primary" />}
              label="이번 주 게더링"
              value={`${weeklyGatherings.length}건`}
              sub="이번 주 예정/진행"
            />
            <KpiCard
              icon={<Users size={22} className="text-blue-500" />}
              label="이번 주 신청"
              value={`${weeklyApplications}건`}
              sub="이번 주 참가 신청 합계"
            />
            <KpiCard
              icon={<TrendingUp size={22} className="text-green-500" />}
              label="이번 주 예상 매출"
              value={`${totalRevenue.toLocaleString()}원`}
              sub="참가비 × 신청자 수"
            />
            <KpiCard
              icon={<LayoutDashboard size={22} className="text-orange-400" />}
              label="모집 중인 게더링"
              value={`${recruitingCount}건`}
              sub="현재 신청 받는 중"
            />
          </div>

          {/* 이번 주 게더링 일정 */}
          <div className="bg-card rounded-card shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">이번 주 게더링 일정</h2>
              <span className="text-xs text-tag-text">{weeklyGatherings.length}건</span>
            </div>

            {weeklyGatherings.length === 0 ? (
              <p className="text-sm text-tag-text py-6 text-center">이번 주 예정된 게더링이 없어요.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-tag-bg">
                      <th className="text-left text-xs text-tag-text font-medium pb-3 pr-4">게더링명</th>
                      <th className="text-left text-xs text-tag-text font-medium pb-3 pr-4">날짜</th>
                      <th className="text-left text-xs text-tag-text font-medium pb-3 pr-4">장소</th>
                      <th className="text-center text-xs text-tag-text font-medium pb-3 pr-4">신청/정원</th>
                      <th className="text-center text-xs text-tag-text font-medium pb-3">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyGatherings.map((g) => (
                      <tr key={g.id} className="border-b border-tag-bg/50 last:border-0 hover:bg-background/50 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-foreground truncate max-w-[200px]">{g.title}</p>
                        </td>
                        <td className="py-3 pr-4 text-tag-text whitespace-nowrap">
                          {dayjs(g.date).format('M/D')} {g.startTime?.slice(0, 5)}
                        </td>
                        <td className="py-3 pr-4 text-tag-text truncate max-w-[120px]">
                          {g.locationName ?? '-'}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="text-primary font-semibold">{g.applicantCount}</span>
                          <span className="text-tag-text">/{g.capacity}</span>
                        </td>
                        <td className="py-3 text-center">
                          <Badge variant={g.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 전체 게더링 현황 */}
          <div className="bg-card rounded-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">전체 게더링 현황</h2>
              <span className="text-xs text-tag-text">총 {gatherings.length}건</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {(['RECRUITING', 'CLOSED', 'COMPLETED', 'CANCELLED'] as AdminGatheringStatus[]).map((status) => {
                const count = gatherings.filter((g) => g.status === status).length
                const pct = gatherings.length > 0 ? Math.round((count / gatherings.length) * 100) : 0
                return (
                  <div key={status} className="bg-background rounded-input p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={status} />
                      <span className="text-sm font-bold text-foreground">{count}건</span>
                    </div>
                    <div className="h-1.5 bg-tag-bg rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          status === 'RECRUITING' ? 'bg-green-500' :
                          status === 'CLOSED' ? 'bg-gray-400' :
                          status === 'COMPLETED' ? 'bg-blue-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-tag-text mt-1">{pct}%</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function KpiCard({
  icon, label, value, sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-card rounded-card shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-tag-text font-medium">{label}</span>
        <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-tag-text">{sub}</p>
    </div>
  )
}
