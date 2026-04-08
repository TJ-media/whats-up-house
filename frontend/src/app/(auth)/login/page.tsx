'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useLogin } from '@/lib/hooks/useAuth'

interface FormValues {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const onSubmit = (data: FormValues) => {
    loginMutation.mutate({ email: data.email, password: data.password })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {/* 로고 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold italic text-primary mb-2">Whatsup House</h1>
        <p className="text-sm text-tag-text">잔잔한 게 좋은 사람들의 공간</p>
      </div>

      {/* 소셜 로그인 */}
      <div className="w-full flex flex-col gap-3 mb-6">
        <Button variant="kakao" size="lg" className="w-full gap-2">
          <span className="text-lg">💬</span>
          카카오로 시작하기
        </Button>
        <Button variant="outlined" size="lg" className="w-full gap-2">
          <span className="font-bold text-base">G</span>
          구글로 시작하기
        </Button>
      </div>

      {/* 구분선 */}
      <div className="flex items-center gap-3 w-full mb-6">
        <div className="flex-1 h-px bg-tag-bg" />
        <span className="text-xs text-tag-text whitespace-nowrap">또는 이메일로 로그인</span>
        <div className="flex-1 h-px bg-tag-bg" />
      </div>

      {/* 이메일 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          {...register('email', { required: '이메일을 입력해주세요' })}
          error={errors.email?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">비밀번호</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요"
              className={`w-full px-4 py-3 pr-12 rounded-input border bg-card text-foreground placeholder:text-tag-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.password ? 'border-primary' : 'border-tag-bg'}`}
              {...register('password', { required: '비밀번호를 입력해주세요' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-tag-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-primary">{errors.password.message}</p>}
        </div>

        <div className="text-right">
          <button type="button" className="text-xs text-tag-text underline">
            비밀번호를 잊으셨나요?
          </button>
        </div>

        {loginMutation.isError && (
          <p className="text-sm text-primary text-center">이메일 또는 비밀번호를 확인해주세요.</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={loginMutation.isPending}
        >
          로그인
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <p className="text-sm text-tag-text mt-6">
        아직 회원이 아니신가요?{' '}
        <Link href="/register" className="text-primary font-semibold">
          회원가입
        </Link>
      </p>
    </div>
  )
}
