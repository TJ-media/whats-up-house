'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertTriangle } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { useSubmitGuestApplication } from '@/lib/hooks/useGatherings'
import type { GatheringDetail, ReferralSource, Gender } from '@/lib/api/types'

const MBTI_ROWS = [
  ['E', 'S', 'F', 'J'],
  ['I', 'N', 'T', 'P'],
] as const

const REFERRAL_OPTIONS: { value: ReferralSource; label: string }[] = [
  { value: 'INSTAGRAM', label: '인스타그램' },
  { value: 'ACQUAINTANCE', label: '지인 추천' },
  { value: 'COMMUNITY', label: '커뮤니티' },
  { value: 'OTHER', label: '기타' },
]

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
]

interface GuestApplicationFormProps {
  gathering: GatheringDetail
}

interface FormValues {
  name: string
  phone: string
  age: string
}

export default function GuestApplicationForm({ gathering }: GuestApplicationFormProps) {
  const router = useRouter()
  const submitMutation = useSubmitGuestApplication()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', phone: '', age: '' },
  })

  const [gender, setGender] = useState<Gender | null>(null)
  const [mbti, setMbti] = useState<(string | null)[]>([null, null, null, null])
  const [referralSource, setReferralSource] = useState<ReferralSource | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const handleMbtiSelect = (colIndex: number, value: string) => {
    setMbti((prev) => {
      const next = [...prev]
      next[colIndex] = prev[colIndex] === value ? null : value
      return next
    })
  }

  const mbtiString = mbti.every((v) => v !== null) ? mbti.join('') : null

  const onSubmit = async (formData: FormValues) => {
    setFormError(null)

    // 추가 유효성 검사
    if (!gender) {
      setFormError('성별을 선택해주세요.')
      return
    }
    if (!mbtiString) {
      setFormError('MBTI를 모두 선택해주세요.')
      return
    }
    if (!referralSource) {
      setFormError('유입 경로를 선택해주세요.')
      return
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(formData.phone)) {
      setFormError('연락처 형식을 확인해주세요. (010-0000-0000)')
      return
    }

    const age = parseInt(formData.age)
    if (isNaN(age) || age < 1 || age > 100) {
      setFormError('올바른 나이를 입력해주세요.')
      return
    }

    try {
      await submitMutation.mutateAsync({
        id: gathering.id,
        data: {
          name: formData.name,
          phone: formData.phone,
          gender,
          age,
          mbti: mbtiString,
          referralSource,
        },
      })
      router.push(`/gatherings/${gathering.id}/apply/complete`)
    } catch {
      setFormError('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* 비로그인 경고 */}
      <Card className="p-4 bg-[#FFF8F0] border border-[#FFE0B2]">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-[#E65100] mt-0.5 shrink-0" />
          <p className="text-sm text-tag-text">
            비로그인 신청은 마일리지가 적립되지 않아요.{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-primary font-semibold underline"
            >
              로그인 후 신청
            </button>
            하시면 혜택을 받을 수 있습니다.
          </p>
        </div>
      </Card>

      {/* 신청자 정보 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-base font-bold text-foreground">신청자 정보</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* 이름 */}
          <Input
            label="이름*"
            placeholder="실명을 입력해주세요"
            {...register('name', { required: '이름을 입력해주세요' })}
            error={errors.name?.message}
          />

          {/* 연락처 */}
          <Input
            label="연락처*"
            placeholder="010-0000-0000"
            {...register('phone', { required: '연락처를 입력해주세요' })}
            error={errors.phone?.message}
          />

          {/* 성별 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">성별*</label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGender(option.value)}
                  className={`flex-1 py-2.5 rounded-input text-sm font-medium transition-colors min-h-[44px] ${
                    gender === option.value
                      ? 'bg-primary text-white'
                      : 'bg-tag-bg text-tag-text'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 나이 */}
          <Input
            label="나이*"
            type="number"
            placeholder="나이를 입력해주세요"
            {...register('age', { required: '나이를 입력해주세요' })}
            error={errors.age?.message}
          />
        </div>
      </div>

      {/* MBTI */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-base font-bold text-foreground">MBTI</h2>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* 첫 번째 행: E S F J */}
          {MBTI_ROWS[0].map((letter, colIndex) => (
            <button
              key={`row0-${letter}`}
              type="button"
              onClick={() => handleMbtiSelect(colIndex, letter)}
              className={`py-3 rounded-input text-sm font-bold transition-colors min-h-[44px] ${
                mbti[colIndex] === letter
                  ? 'bg-primary text-white'
                  : 'bg-tag-bg text-tag-text'
              }`}
            >
              {letter}
            </button>
          ))}
          {/* 두 번째 행: I N T P */}
          {MBTI_ROWS[1].map((letter, colIndex) => (
            <button
              key={`row1-${letter}`}
              type="button"
              onClick={() => handleMbtiSelect(colIndex, letter)}
              className={`py-3 rounded-input text-sm font-bold transition-colors min-h-[44px] ${
                mbti[colIndex] === letter
                  ? 'bg-primary text-white'
                  : 'bg-tag-bg text-tag-text'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {mbtiString && (
          <p className="text-center text-sm text-primary font-medium mt-3">
            당신은 {mbtiString} 유형이군요!
          </p>
        )}
      </div>

      {/* 한 줄 자기소개 */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-1">한 줄 자기소개</label>
        <textarea
          placeholder="당신은 어떤 분인가요? 가볍게 알려주세요."
          className="w-full px-4 py-3 rounded-input border border-tag-bg bg-card text-foreground text-sm placeholder:text-tag-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[80px]"
          rows={3}
        />
      </div>

      {/* 유입경로 */}
      <div>
        <label className="text-sm font-bold text-foreground block mb-3">유입경로</label>
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
                referralSource === option.value
                  ? 'border-primary'
                  : 'border-tag-bg'
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
