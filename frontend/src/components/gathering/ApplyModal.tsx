'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'
import type { GatheringDetail } from '@/lib/api/types'
import dayjs from 'dayjs'

interface ApplyModalProps {
  gathering: GatheringDetail
  isOpen: boolean
  onClose: () => void
  onLoginApply: () => void
  onGuestApply: () => void
}

export default function ApplyModal({
  gathering,
  isOpen,
  onClose,
  onLoginApply,
  onGuestApply,
}: ApplyModalProps) {
  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const formattedDate = dayjs(gathering.date).format('M월 D일 (ddd)')
  const formattedTime = `오후 ${gathering.startTime?.slice(0, 5) ?? ''}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div className="relative w-full max-w-[390px] bg-card rounded-t-[24px] px-5 pt-6 pb-8 animate-slide-up">
        {/* 핸들바 */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-tag-bg" />
        </div>

        {/* 제목 */}
        <h2 className="text-lg font-bold text-foreground text-center mb-5">
          신청 방법을 선택해주세요
        </h2>

        {/* 게더링 정보 */}
        <div className="flex items-center gap-3 bg-background rounded-card p-3 mb-6">
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
            <p className="text-sm font-bold text-foreground truncate">{gathering.title}</p>
            <p className="text-xs text-tag-text mt-1">
              {formattedDate} · {formattedTime}
            </p>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full flex-col gap-0.5 !py-3.5"
            onClick={onLoginApply}
          >
            <span className="font-bold">로그인하고 신청하기</span>
            <span className="text-xs font-normal opacity-80">마일리지 적립 및 예약 내역 확인이 가능해요</span>
          </Button>

          <Button
            variant="outlined"
            size="lg"
            className="w-full flex-col gap-0.5 !py-3.5"
            onClick={onGuestApply}
          >
            <span className="font-bold">로그인 없이 신청하기</span>
            <span className="text-xs font-normal opacity-60">마일리지 적립이 되지 않아요</span>
          </Button>
        </div>

        {/* 취소 */}
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-tag-text mt-5 py-2 min-h-[44px]"
        >
          취소
        </button>
      </div>
    </div>
  )
}
