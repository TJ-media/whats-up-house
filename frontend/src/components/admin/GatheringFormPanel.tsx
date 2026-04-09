'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { adminGatheringApi, AdminGatheringListItem, GatheringCreateRequest } from '@/lib/api/adminGathering'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface GatheringFormPanelProps {
  gathering: AdminGatheringListItem | null
  onClose: () => void
  onSuccess: () => void
}

export function GatheringFormPanel({ gathering, onClose, onSuccess }: GatheringFormPanelProps) {
  const { register, handleSubmit, setValue, reset } = useForm<GatheringCreateRequest & { howToRunText?: string; moodTagsText?: string }>()
  const isEdit = !!gathering

  const { data: locations } = useQuery({
    queryKey: ['admin', 'locations'],
    queryFn: adminGatheringApi.getLocations,
  })

  useEffect(() => {
    if (gathering) {
      setValue('title', gathering.title)
      setValue('date', gathering.date)
      setValue('startTime', gathering.startTime.slice(0, 5))
      setValue('endTime', gathering.endTime?.slice(0, 5) ?? '')
      setValue('price', gathering.price)
      setValue('capacity', gathering.capacity)
    } else {
      reset()
    }
  }, [gathering, setValue, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GatheringCreateRequest) =>
      isEdit
        ? adminGatheringApi.update(gathering!.id, data)
        : adminGatheringApi.create(data),
    onSuccess,
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg || '저장 중 오류가 발생했어요.')
    },
  })

  const onSubmit = (raw: GatheringCreateRequest & { howToRunText?: string; moodTagsText?: string }) => {
    const data: GatheringCreateRequest = {
      ...raw,
      price: Number(raw.price),
      capacity: Number(raw.capacity),
      mileageReward: raw.mileageReward ? Number(raw.mileageReward) : 500,
      howToRun: raw.howToRunText ? raw.howToRunText.split('\n').filter(Boolean) : [],
      moodTags: raw.moodTagsText ? raw.moodTagsText.split(',').map((t) => t.trim()).filter(Boolean) : [],
    }
    mutate(data)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 w-[480px] h-full bg-white shadow-2xl z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE8]">
          <h2 className="font-bold text-[18px]">{isEdit ? '게더링 수정' : '게더링 추가'}</h2>
          <button onClick={onClose} className="text-[#767676] text-xl leading-none">✕</button>
        </div>

        {/* 폼 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            <Input label="게더링명 *" placeholder="게더링 이름을 입력해주세요" {...register('title', { required: true })} />

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">게더링 소개 *</label>
              <textarea
                className="w-full h-[100px] px-4 py-3 border border-tag-bg rounded-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="게더링에 대해 소개해주세요"
                {...register('description', { required: true })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">진행 방식 (줄바꿈으로 구분)</label>
              <textarea
                className="w-full h-[80px] px-4 py-3 border border-tag-bg rounded-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={'1단계 내용\n2단계 내용'}
                {...register('howToRunText')}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">장소 *</label>
              <select
                className="w-full h-[52px] px-4 border border-tag-bg rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('locationId', { required: true })}
              >
                <option value="">장소를 선택해주세요</option>
                {locations?.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <Input label="날짜 *" type="date" {...register('date', { required: true })} />

            <div className="grid grid-cols-2 gap-3">
              <Input label="시작 시간 *" type="time" {...register('startTime', { required: true })} />
              <Input label="종료 시간 *" type="time" {...register('endTime', { required: true })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="참가비 (원) *" type="number" min={0} {...register('price', { required: true })} />
              <Input label="모집 정원 (최대 20) *" type="number" min={1} max={20} {...register('capacity', { required: true })} />
            </div>

            <Input label="분위기 태그 (쉼표 구분)" placeholder="조용한,감성적인" {...register('moodTagsText')} />
            <Input label="마일리지 적립" type="number" placeholder="500" {...register('mileageReward')} />
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#F0EBE8]">
          <Button variant="ghost" type="button" onClick={onClose} className="flex-1">취소</Button>
          <Button
            variant="primary"
            type="button"
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
          >
            저장하기
          </Button>
        </div>
      </div>
    </>
  )
}
