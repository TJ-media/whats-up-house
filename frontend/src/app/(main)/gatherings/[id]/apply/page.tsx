'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useGatheringDetail } from '@/lib/hooks/useGatherings'
import { LoadingSpinner, ApiErrorMessage } from '@/components/ui'
import GuestApplicationForm from '@/components/gathering/GuestApplicationForm'
import UserApplicationForm from '@/components/gathering/UserApplicationForm'
import dayjs from 'dayjs'

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') ?? 'guest'

  const { data: gathering, isLoading, isError, refetch } = useGatheringDetail(id)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !gathering) {
    return (
      <div className="min-h-screen bg-background px-4 pt-20">
        <ApiErrorMessage
          message="게더링 정보를 불러올 수 없습니다."
          onRetry={() => { refetch() }}
        />
      </div>
    )
  }

  const formattedDate = dayjs(gathering.date).format('YYYY. MM. DD (ddd)')
  const formattedTime = gathering.startTime?.slice(0, 5) ?? ''

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-background border-b border-tag-bg/50">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => router.back()}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-foreground pr-11">
            게더링 신청
          </h1>
        </div>
      </header>

      <div className="px-4 pt-4 pb-6">
        {/* 게더링 정보 미니카드 */}
        <div className="flex items-center gap-3 bg-card rounded-card p-3 mb-5 shadow-sm">
          <div className="w-16 h-16 rounded-[12px] overflow-hidden shrink-0 bg-tag-bg">
            {gathering.thumbnailUrl ? (
              <img
                src={gathering.thumbnailUrl}
                alt={gathering.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-tag-bg" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {type === 'user' && (
              <span className="text-[10px] text-primary font-semibold">Curator&apos;s Choice</span>
            )}
            <p className="text-sm font-bold text-foreground truncate">{gathering.title}</p>
            <p className="text-xs text-tag-text mt-0.5">
              📅 {formattedDate} {formattedTime}
            </p>
          </div>
        </div>

        {/* 폼 분기 */}
        {type === 'user' ? (
          <UserApplicationForm gathering={gathering} />
        ) : (
          <GuestApplicationForm gathering={gathering} />
        )}
      </div>
    </div>
  )
}
