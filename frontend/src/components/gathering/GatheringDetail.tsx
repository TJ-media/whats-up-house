'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Calendar, Clock, MapPin, Users, CreditCard, AlertTriangle, Star } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import type { GatheringDetail as GatheringDetailType } from '@/lib/api/types'
import dayjs from 'dayjs'

interface GatheringDetailProps {
  gathering: GatheringDetailType
}

export default function GatheringDetail({ gathering }: GatheringDetailProps) {
  const router = useRouter()

  const {
    title, date, startTime, endTime, locationName, locationAddress,
    price, capacity, currentApplicants, thumbnailUrl,
    status, moodTags, activityTags,
    description, howToRun, photoUrls,
    averageRating, reviewCount,
  } = gathering

  const formattedDate = dayjs(date).format('YYYY년 M월 D일 dddd')
  const formattedStartTime = startTime?.slice(0, 5) ?? ''
  const formattedEndTime = endTime?.slice(0, 5) ?? ''

  // 소요시간 계산
  const startMinutes = startTime ? parseInt(startTime.slice(0, 2)) * 60 + parseInt(startTime.slice(3, 5)) : 0
  const endMinutes = endTime ? parseInt(endTime.slice(0, 2)) * 60 + parseInt(endTime.slice(3, 5)) : 0
  const durationMinutes = endMinutes - startMinutes
  const durationHours = Math.floor(durationMinutes / 60)
  const durationMins = durationMinutes % 60
  const durationStr = durationMins > 0
    ? `${durationHours}시간 ${durationMins}분`
    : `${durationHours}시간`

  const allTags = [...(moodTags ?? []), ...(activityTags ?? [])]

  return (
    <div className="bg-card">
      {/* 헤더 */}
      <div className="relative">
        {/* 썸네일 */}
        <div className="relative w-full aspect-[390/260] bg-tag-bg">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-tag-bg to-background" />
          )}

          {/* 헤더 오버레이 */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              aria-label="뒤로가기"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm min-h-[44px] min-w-[44px]"
              aria-label="공유하기"
            >
              <Share2 size={18} className="text-white" />
            </button>
          </div>

          {/* 와썹하우스 주최 뱃지 */}
          <div className="absolute bottom-3 left-4">
            <span className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">
              와썹하우스 주최
            </span>
          </div>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="px-4 pt-5 pb-4">
        {/* 제목 */}
        <h1 className="text-xl font-bold text-foreground leading-tight mb-3">{title}</h1>

        {/* 태그 목록 */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {allTags.map((tag) => (
              <span key={tag} className="text-xs bg-tag-bg text-tag-text px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 정보 카드 */}
        <Card className="p-4 mb-6 border border-tag-bg/50">
          <div className="flex flex-col gap-3.5">
            {/* 날짜 */}
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-tag-text mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-tag-text mb-0.5">날짜</p>
                <p className="text-sm font-semibold text-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* 시간 */}
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-tag-text mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-tag-text mb-0.5">시간</p>
                <p className="text-sm font-semibold text-foreground">
                  오후 {formattedStartTime} - {formattedEndTime} ({durationStr})
                </p>
              </div>
            </div>

            {/* 장소 */}
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-tag-text mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-tag-text mb-0.5">장소</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{locationName}</p>
                  <button className="text-xs text-primary font-medium min-h-[44px] flex items-center">
                    지도 보기
                  </button>
                </div>
              </div>
            </div>

            {/* 모집인원 */}
            <div className="flex items-start gap-3">
              <Users size={18} className="text-tag-text mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-tag-text mb-0.5">모집인원</p>
                <p className="text-sm font-semibold text-foreground">
                  <span className="text-primary">{currentApplicants}</span>/{capacity}명
                </p>
              </div>
            </div>

            {/* 참가비 */}
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="text-tag-text mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-tag-text mb-0.5">참가비</p>
                <p className="text-lg font-bold text-foreground">
                  {price.toLocaleString()}원 <span className="text-xs font-normal text-tag-text">(현장 결제)</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 게더링 설명 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-base font-bold text-foreground">이런 게더링이에요</h2>
          </div>
          <p className="text-sm text-tag-text leading-relaxed whitespace-pre-line">{description}</p>
        </div>

        {/* 진행방식 */}
        {howToRun && howToRun.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="text-base font-bold text-foreground">이렇게 진행돼요</h2>
            </div>
            <div className="flex flex-col gap-4">
              {howToRun.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-light text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-tag-text leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        <div className="mb-6">
          <Card className="p-4 bg-[#FFF8F0] border border-[#FFE0B2]">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-[#E65100] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground mb-2">이런 분은 참여가 어려워요</p>
                <ul className="text-sm text-tag-text space-y-1.5">
                  <li>지나친 소란으로 감상을 방해하시는 분</li>
                  <li>본인의 취향만을 강요하며 타인의 의견을 무시하시는 분</li>
                  <li>상업적인 목적이나 홍보를 위해 참석하시는 분</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* 후기 섹션 */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-base font-bold text-foreground">참가자 후기</h2>
          </div>

          {reviewCount > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              {/* 후기 카드 예시 (실제 후기 데이터 연결시 교체) */}
              <Card className="min-w-[200px] max-w-[200px] p-4 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-tag-bg" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">참가자</p>
                    <p className="text-[10px] text-tag-text">2024.05.20</p>
                  </div>
                </div>
                <p className="text-xs text-tag-text leading-relaxed line-clamp-3">
                  &quot;분위기가 너무 좋았어요. 다음에도 참여하고 싶습니다!&quot;
                </p>
              </Card>
              <Card className="min-w-[200px] max-w-[200px] p-4 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-tag-bg" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">참가자</p>
                    <p className="text-[10px] text-tag-text">2024.05.18</p>
                  </div>
                </div>
                <p className="text-xs text-tag-text leading-relaxed line-clamp-3">
                  &quot;편안한 분위기에서 좋은 사람들과 시간을 보낼 수 있었습니다.&quot;
                </p>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-tag-text py-4">아직 후기가 없어요.</p>
          )}
        </div>
      </div>
    </div>
  )
}
