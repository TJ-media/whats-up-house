'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useGatheringDetail } from '@/lib/hooks/useGatherings'
import { useAuthStore } from '@/lib/store/authStore'
import { LoadingSpinner, ApiErrorMessage, Button } from '@/components/ui'
import GatheringDetail from '@/components/gathering/GatheringDetail'
import ApplyModal from '@/components/gathering/ApplyModal'

export default function GatheringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const { data: gathering, isLoading, isError, refetch } = useGatheringDetail(id)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const isRecruiting = gathering.status === 'RECRUITING'

  const handleApplyClick = () => {
    if (isLoggedIn) {
      // 로그인 상태면 바로 회원 폼으로
      router.push(`/gatherings/${id}/apply?type=user`)
    } else {
      // 비로그인 상태면 모달 표시
      setIsModalOpen(true)
    }
  }

  const handleLoginApply = () => {
    setIsModalOpen(false)
    router.push(`/login?redirect=/gatherings/${id}/apply?type=user`)
  }

  const handleGuestApply = () => {
    setIsModalOpen(false)
    router.push(`/gatherings/${id}/apply?type=guest`)
  }

  return (
    <div className="min-h-screen bg-background pb-[80px]">
      {/* 상세 본문 */}
      <GatheringDetail gathering={gathering} />

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-card border-t border-tag-bg/50 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-tag-text">참가비</p>
            <p className="text-lg font-bold text-foreground">{gathering.price.toLocaleString()}원</p>
          </div>
          <Button
            variant="primary"
            size="default"
            className="px-8"
            disabled={!isRecruiting}
            onClick={handleApplyClick}
          >
            {isRecruiting ? '신청하기' : '마감'}
          </Button>
        </div>
      </div>

      {/* 신청 방법 선택 모달 */}
      <ApplyModal
        gathering={gathering}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginApply={handleLoginApply}
        onGuestApply={handleGuestApply}
      />
    </div>
  )
}
