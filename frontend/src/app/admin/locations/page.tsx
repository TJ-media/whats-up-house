'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGatheringApi, LocationItem } from '@/lib/api/adminGathering'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useForm } from 'react-hook-form'

const CONTRACT_LABEL: Record<string, string> = {
  ACTIVE: '계약중',
  PENDING: '협의중',
  EXPIRED: '만료',
}
const CONTRACT_STYLE: Record<string, string> = {
  ACTIVE: 'bg-[#E8F5E9] text-[#4CAF50]',
  PENDING: 'bg-[#FFF3E0] text-[#FF9800]',
  EXPIRED: 'bg-[#F5F5F5] text-[#767676]',
}

type LocationFormData = {
  name: string
  address: string
  maxCapacity: number
  contractStatus: string
  featuresText?: string
}

function LocationModal({
  location,
  onClose,
  onSuccess,
}: {
  location: LocationItem | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEdit = !!location
  const { register, handleSubmit } = useForm<LocationFormData>({
    defaultValues: location
      ? {
          name: location.name,
          address: location.address,
          maxCapacity: location.maxCapacity,
          contractStatus: location.contractStatus,
          featuresText: location.features?.join(', ') ?? '',
        }
      : { contractStatus: 'ACTIVE' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<LocationItem>) =>
      isEdit
        ? adminGatheringApi.updateLocation(location!.id, data)
        : adminGatheringApi.createLocation(data),
    onSuccess,
    onError: () => alert('저장 중 오류가 발생했습니다.'),
  })

  const onSubmit = (raw: LocationFormData) => {
    mutate({
      name: raw.name,
      address: raw.address,
      maxCapacity: Number(raw.maxCapacity),
      contractStatus: raw.contractStatus,
      features: raw.featuresText
        ? raw.featuresText.split(',').map((f) => f.trim()).filter(Boolean)
        : null,
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-[16px] shadow-2xl w-[480px] pointer-events-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE8]">
            <h2 className="font-bold text-[18px]">{isEdit ? '장소 수정' : '장소 추가'}</h2>
            <button onClick={onClose} className="text-[#767676] text-xl leading-none">✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
            <Input label="장소명 *" placeholder="장소 이름" {...register('name', { required: true })} />
            <Input label="주소 *" placeholder="서울특별시 강남구..." {...register('address', { required: true })} />
            <Input label="최대 수용 인원 *" type="number" min={1} max={20} {...register('maxCapacity', { required: true })} />
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">계약 상태</label>
              <select
                className="w-full h-[52px] px-4 border border-tag-bg rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('contractStatus')}
              >
                <option value="ACTIVE">계약중</option>
                <option value="PENDING">협의중</option>
                <option value="EXPIRED">만료</option>
              </select>
            </div>
            <Input label="특징 (쉼표 구분)" placeholder="루프탑,주차가능,노키즈존" {...register('featuresText')} />
            <div className="flex gap-3 mt-2">
              <Button variant="ghost" type="button" onClick={onClose} className="flex-1">취소</Button>
              <Button variant="primary" type="submit" isLoading={isPending} className="flex-1">저장하기</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default function AdminLocationsPage() {
  const queryClient = useQueryClient()
  const [modalLocation, setModalLocation] = useState<LocationItem | null | undefined>(undefined)

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['admin', 'locations'],
    queryFn: adminGatheringApi.getLocations,
  })

  const { mutate: deleteLocation } = useMutation({
    mutationFn: adminGatheringApi.deleteLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'locations'] }),
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" 장소를 삭제할까요?`)) deleteLocation(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-[22px] text-foreground">장소 관리</h1>
        <button
          id="btn-location-add"
          onClick={() => setModalLocation(null)}
          className="px-5 h-11 bg-primary text-white rounded-[12px] font-medium text-sm hover:opacity-90 transition-opacity"
        >
          + 장소 추가
        </button>
      </div>

      <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F5F5] text-xs text-[#767676] uppercase">
              {['장소명', '주소', '최대 수용', '계약 상태', '특징', '액션'].map((col) => (
                <th key={col} className="px-4 py-3 text-left font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="py-12 text-center"><LoadingSpinner /></td></tr>
            )}
            {!isLoading && locations.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-sm text-[#767676]">등록된 장소가 없습니다.</td></tr>
            )}
            {locations.map((loc) => (
              <tr key={loc.id} className="border-t border-[#F0EBE8] hover:bg-[#F5F0EB] transition-colors">
                <td className="px-4 py-3 font-medium text-[14px]">{loc.name}</td>
                <td className="px-4 py-3 text-[13px] text-[#767676] max-w-[200px] truncate">{loc.address}</td>
                <td className="px-4 py-3 text-[13px]">{loc.maxCapacity}명</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${CONTRACT_STYLE[loc.contractStatus] ?? ''}`}>
                    {CONTRACT_LABEL[loc.contractStatus] ?? loc.contractStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#767676]">
                  {loc.features?.join(', ') ?? '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-[13px]">
                    <button onClick={() => setModalLocation(loc)} className="text-primary hover:underline">수정</button>
                    <button onClick={() => handleDelete(loc.id, loc.name)} className="text-red-500 hover:underline">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 장소 추가/수정 모달 */}
      {modalLocation !== undefined && (
        <LocationModal
          location={modalLocation}
          onClose={() => setModalLocation(undefined)}
          onSuccess={() => {
            setModalLocation(undefined)
            queryClient.invalidateQueries({ queryKey: ['admin', 'locations'] })
          }}
        />
      )}
    </div>
  )
}
