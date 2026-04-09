'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useRegister } from '@/lib/hooks/useAuth'
import { useAuthStore } from '@/lib/store/authStore'
import { checkNickname, login } from '@/lib/api/auth'
import { getRandomAnimalType } from '@/lib/utils/animalProfile'
import type { Gender } from '@/lib/api/types'

const MBTI_ROWS = [
  ['E', 'S', 'T', 'J'],
  ['I', 'N', 'F', 'P'],
] as const

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남' },
  { value: 'FEMALE', label: '여' },
]

const INTERESTS = ['감성', '독서', '음악', '자연', '요리', '운동', '여행', '영화', '미술', '사진']

export default function OnboardingPage() {
  const router = useRouter()
  const registerMutation = useRegister()
  const { login: storeLogin } = useAuthStore()

  const [nickname, setNickname] = useState('')
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState<Gender | null>(null)
  const [age, setAge] = useState('')
  const [job, setJob] = useState('')
  const [mbti, setMbti] = useState<(string | null)[]>([null, null, null, null])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const mbtiString = mbti.every((v) => v !== null) ? mbti.join('') : undefined

  const handleCheckNickname = async () => {
    if (nickname.length < 2) {
      setFormError('닉네임은 2자 이상 입력해주세요.')
      return
    }
    setNicknameStatus('checking')
    setFormError(null)
    try {
      const result = await checkNickname(nickname)
      setNicknameStatus(result.available ? 'available' : 'taken')
    } catch {
      setNicknameStatus('idle')
      setFormError('닉네임 확인 중 오류가 발생했습니다.')
    }
  }

  const handleMbtiSelect = (colIndex: number, value: string) => {
    setMbti((prev) => {
      const next = [...prev]
      next[colIndex] = prev[colIndex] === value ? null : value
      return next
    })
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleSubmit = async () => {
    setFormError(null)

    if (!nickname || nicknameStatus !== 'available') {
      setFormError('닉네임 중복 확인을 해주세요.')
      return
    }

    // Step 1 데이터 복원
    const step1Raw = sessionStorage.getItem('register_step1')
    if (!step1Raw) {
      router.push('/register')
      return
    }
    const step1 = JSON.parse(step1Raw) as { name: string; email: string; password: string }

    try {
      await registerMutation.mutateAsync({
        email: step1.email,
        password: step1.password,
        nickname,
        bio: bio || undefined,
        gender: gender ?? undefined,
        age: age ? parseInt(age) : undefined,
        job: job || undefined,
        mbti: mbtiString,
        animalType: getRandomAnimalType(),
        interests: selectedInterests.length > 0 ? selectedInterests : undefined,
      })

      // 회원가입은 토큰을 반환하지 않으므로 별도 로그인
      const loginResponse = await login(step1.email, step1.password)
      sessionStorage.removeItem('register_step1')
      storeLogin(loginResponse.accessToken, loginResponse.user.id, loginResponse.user.nickname, loginResponse.user.admin)
      router.push('/')
    } catch {
      setFormError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

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
            프로필 설정
          </h1>
        </div>
      </header>

      <div className="px-6 pt-6 pb-10">
        {/* 스텝 인디케이터 */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-tag-bg" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
        <p className="text-center text-sm text-tag-text mb-8">어떤 분인지 알려주세요</p>

        <div className="flex flex-col gap-6">
          {/* 닉네임 */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">닉네임 *</label>
            <div className="flex gap-2">
              <input
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); setNicknameStatus('idle') }}
                placeholder="닉네임을 입력해주세요"
                className="flex-1 px-4 py-3 rounded-input border border-tag-bg bg-card text-foreground placeholder:text-tag-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                variant="outlined"
                size="sm"
                onClick={handleCheckNickname}
                isLoading={nicknameStatus === 'checking'}
                className="shrink-0 px-3"
              >
                중복확인
              </Button>
            </div>
            {nicknameStatus === 'available' && (
              <p className="text-xs text-green-600 mt-1">✓ 사용 가능한 닉네임이에요</p>
            )}
            {nicknameStatus === 'taken' && (
              <p className="text-xs text-primary mt-1">이미 사용 중인 닉네임이에요</p>
            )}
          </div>

          {/* 한 줄 소개 */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              한 줄 소개 <span className="text-tag-text font-normal">(선택)</span>
            </label>
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="나를 한 줄로 소개해주세요"
              className="w-full px-4 py-3 rounded-input border border-tag-bg bg-card text-foreground placeholder:text-tag-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">성별</label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGender(option.value)}
                  className={`flex-1 py-2.5 rounded-input text-sm font-medium transition-colors min-h-[44px] ${
                    gender === option.value ? 'bg-primary text-white' : 'bg-tag-bg text-tag-text'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 나이 + 직업 */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="나이"
                type="number"
                placeholder="나이"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                label="직업"
                placeholder="직업"
                value={job}
                onChange={(e) => setJob(e.target.value)}
              />
            </div>
          </div>

          {/* MBTI */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">MBTI</label>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_ROWS[0].map((letter, colIndex) => (
                <button
                  key={`row0-${letter}`}
                  type="button"
                  onClick={() => handleMbtiSelect(colIndex, letter)}
                  className={`py-3 rounded-input text-sm font-bold transition-colors min-h-[44px] ${
                    mbti[colIndex] === letter ? 'bg-primary text-white' : 'bg-tag-bg text-tag-text'
                  }`}
                >
                  {letter}
                </button>
              ))}
              {MBTI_ROWS[1].map((letter, colIndex) => (
                <button
                  key={`row1-${letter}`}
                  type="button"
                  onClick={() => handleMbtiSelect(colIndex, letter)}
                  className={`py-3 rounded-input text-sm font-bold transition-colors min-h-[44px] ${
                    mbti[colIndex] === letter ? 'bg-primary text-white' : 'bg-tag-bg text-tag-text'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
            {mbtiString && (
              <p className="text-center text-sm text-primary font-medium mt-2">
                {mbtiString} 유형이군요!
              </p>
            )}
          </div>

          {/* 관심 분야 */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">관심 분야 우선 순위</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    selectedInterests.includes(interest)
                      ? 'bg-primary text-white'
                      : 'bg-tag-bg text-tag-text'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* 에러 메시지 */}
          {formError && (
            <p className="text-sm text-primary text-center">{formError}</p>
          )}

          {/* 시작하기 버튼 */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            isLoading={registerMutation.isPending}
          >
            시작하기
          </Button>
        </div>
      </div>
    </div>
  )
}
