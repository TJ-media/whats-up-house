'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button, Card, LoadingSpinner } from '@/components/ui'
import { useSubmitUserApplication } from '@/lib/hooks/useGatherings'
import { useMyProfile } from '@/lib/hooks/useAuth'
import type { GatheringDetail, ReferralSource } from '@/lib/api/types'

const REFERRAL_OPTIONS: { value: ReferralSource; label: string }[] = [
  { value: 'INSTAGRAM', label: '인스타그램' },
  { value: 'FRIEND', label: '지인 추천' },
  { value: 'BLOG', label: '블로그/커뮤니티' },
  { value: 'OTHER', label: '기타' },
]

const GENDER_LABEL: Record<string, string> = {
  MALE: '남성',
  FEMALE: '여성',
  NONE: '선택 안함',
}

const JOB_LABEL: Record<string, string> = {
  STUDENT: '대학생',
  WORKER: '직장인',
  FREELANCER: '프리랜서',
  OTHER: '기타',
}

interface UserApplicationFormProps {
  gathering: GatheringDetail
}

export default function UserApplicationForm({ gathering }: UserApplicationFormProps) {
  const router = useRouter()
  const submitMutation = useSubmitUserApplication()
  const { data: profile, isLoading: profileLoading } = useMyProfile()

  const [introduction, setIntroduction] = useState('')
  const [referralSource, setReferralSource] = useState<ReferralSource | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!referralSource) {
      setFormError('유입 경로를 선택해주세요.')
      return
    }

    if (!profile?.gender || !profile?.age) {
      setFormError('프로필에 성별과 나이 정보가 필요합니다. 마이페이지에서 설정해주세요.')
      return
    }

    try {
      await submitMutation.mutateAsync({
        id: gathering.id,
        data: {
          gender: profile.gender as 'MALE' | 'FEMALE',
          age: profile.age,
          job: profile.job ?? undefined,
          mbti: profile.mbti ?? undefined,
          intro: introduction || '',
          referralSource,
        },
      })
      router.push(`/gatherings/${gathering.id}/apply/complete`)
    } catch {
      setFormError('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const genderAge = [
    profile?.gender ? GENDER_LABEL[profile.gender] ?? profile.gender : null,
    profile?.age ? `${profile.age}세` : null,
  ].filter(Boolean).join(' / ') || '미입력'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 신청 정보 확인 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#E8A87C] rounded-full" />
          <h2 className="text-base font-bold text-foreground">신청 정보 확인</h2>
        </div>

        <Card className="p-5 border border-tag-bg/50">
          {profileLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-tag-bg mb-2 flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <p className="text-xs text-tag-text">신청자</p>
                <p className="text-lg font-bold text-foreground">{profile?.nickname ?? '회원'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-tag-text mb-1">이메일</p>
                  <p className="font-medium text-foreground">{profile?.email ?? '미입력'}</p>
                </div>
                <div>
                  <p className="text-xs text-tag-text mb-1">성별/나이</p>
                  <p className="font-medium text-foreground">{genderAge}</p>
                </div>
                <div>
                  <p className="text-xs text-tag-text mb-1">직업</p>
                  <p className="font-medium text-foreground">
                    {profile?.job ? (JOB_LABEL[profile.job] ?? profile.job) : '미입력'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-tag-text mb-1">MBTI</p>
                  <p className="font-medium text-foreground">{profile?.mbti ?? '미입력'}</p>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => router.push('/mypage')}
            className="text-xs text-primary font-medium mt-4 min-h-[44px]"
          >
            정보가 다른가요? 프로필 설정에서 수정해주세요 →
          </button>
        </Card>
      </div>

      {/* 한 줄 자기소개 */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-1">
          한 줄 자기소개 <span className="text-tag-text font-normal">(선택)</span>
        </label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="신청하는 이유나 게더링에서 기대하는 점을 들려주세요."
          className="w-full px-4 py-3 rounded-input border border-tag-bg bg-card text-foreground text-sm placeholder:text-tag-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[80px]"
          rows={3}
        />
      </div>

      {/* 유입 경로 */}
      <div>
        <label className="text-sm font-bold text-foreground block mb-3">유입 경로</label>
        <div className="grid grid-cols-2 gap-2">
          {REFERRAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setReferralSource(option.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-input text-sm font-medium transition-colors min-h-[44px] border ${
                referralSource === option.value
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-tag-bg bg-card text-tag-text'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                referralSource === option.value ? 'border-primary' : 'border-tag-bg'
              }`}>
                {referralSource === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 마일리지 안내 */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#E8F5E9] rounded-input">
        <CheckCircle size={18} className="text-[#2E7D32] shrink-0" />
        <p className="text-sm text-[#2E7D32] font-medium">
          참여 완료 후 {gathering.mileageReward || 500} 마일리지가 적립돼요
        </p>
      </div>

      {/* 에러 메시지 */}
      {formError && (
        <p className="text-sm text-primary text-center">{formError}</p>
      )}

      {/* 신청 버튼 */}
      <div className="pt-2 pb-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={submitMutation.isPending}
        >
          신청 완료하기
        </Button>
      </div>
    </form>
  )
}
