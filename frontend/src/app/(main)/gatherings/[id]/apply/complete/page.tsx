'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Calendar, MapPin, CreditCard } from 'lucide-react'
import { useGatheringDetail } from '@/lib/hooks/useGatherings'
import { Button, Card, LoadingSpinner } from '@/components/ui'
import dayjs from 'dayjs'

export default function ApplyCompletePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: gathering, isLoading } = useGatheringDetail(id)

  if (isLoading || !gathering) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const formattedDate = dayjs(gathering.date).format('YYYY년 M월 D일 (ddd)')
  const formattedTime = gathering.startTime?.slice(0, 5) ?? ''

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center px-6 pt-16 pb-6">
        {/* 완료 아이콘 */}
        <div className="w-40 h-40 mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center">
              <CheckCircle size={56} className="text-primary" />
            </div>
            {/* 데코 도트 */}
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#FFE082]" />
            <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-[#A5D6A7]" />
            <div className="absolute top-4 -left-4 w-2 h-2 rounded-full bg-[#CE93D8]" />
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-foreground mb-2">신청이 완료됐어요! 🎉</h1>
        <p className="text-sm text-tag-text mb-8">게더링 당일에 뵙겠습니다</p>

        {/* 게더링 요약 카드 */}
        <Card className="w-full p-5 mb-8">
          <p className="text-xs text-tag-text mb-1">신청한 게더링</p>
          <h2 className="text-base font-bold text-foreground mb-4">{gathering.title}</h2>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-tag-text shrink-0" />
              <div>
                <p className="text-xs text-tag-text">날짜 + 시간</p>
                <p className="text-sm font-medium text-foreground">
                  {formattedDate} {formattedTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-tag-text shrink-0" />
              <div>
                <p className="text-xs text-tag-text">장소</p>
                <p className="text-sm font-medium text-foreground">{gathering.locationName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-tag-text shrink-0" />
              <div>
                <p className="text-xs text-tag-text">참가비</p>
                <p className="text-sm font-medium text-foreground">
                  {gathering.price.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-tag-bg/50">
            <p className="text-xs text-tag-text text-center">
              참가비는 당일 현장에서 결제해주세요
            </p>
          </div>
        </Card>

        {/* 버튼들 */}
        <div className="w-full flex flex-col gap-3">
          <Button
            variant="kakao"
            size="lg"
            className="w-full"
            onClick={() => {
              // 카카오톡 알림 연동 (추후 구현)
            }}
          >
            ● 카카오톡으로 일정 알림 받기
          </Button>

          <Button
            variant="outlined"
            size="lg"
            className="w-full"
            onClick={() => router.push('/mypage')}
          >
            내 신청 내역 확인하기
          </Button>

          <button
            onClick={() => router.push('/')}
            className="text-sm text-tag-text underline py-3 min-h-[44px]"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
