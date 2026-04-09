'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGatheringApi, AdminGatheringListItem } from '@/lib/api/adminGathering'
import { GatheringFormPanel } from '@/components/admin/GatheringFormPanel'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import dayjs from 'dayjs'

const STATUS_OPTIONS = ['전체', 'RECRUITING', 'CLOSED', 'COMPLETED', 'CANCELLED']
const STATUS_LABEL: Record<string, string> = {
  전체: '전체',
  RECRUITING: '모집중',
  CLOSED: '마감',
  COMPLETED: '진행완료',
  CANCELLED: '취소',
}
const STATUS_STYLE: Record<string, string> = {
  RECRUITING: 'bg-[#FDECEA] text-[#C8392B]',
  CLOSED: 'bg-[#F5F5F5] text-[#767676]',
  COMPLETED: 'bg-[#E8F5E9] text-[#4CAF50]',
  CANCELLED: 'bg-[#FEF3F3] text-red-500',
}

export default function AdminGatheringsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('전체')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingGathering, setEditingGathering] = useState<AdminGatheringListItem | null>(null)

  const { data: gatherings = [], isLoading } = useQuery({
    queryKey: ['admin', 'gatherings', statusFilter],
    queryFn: () =>
      adminGatheringApi.getAll(statusFilter === '전체' ? undefined : statusFilter),
  })

  const { mutate: deleteGathering } = useMutation({
    mutationFn: adminGatheringApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'gatherings'] }),
  })

  const handleOpenEdit = (g: AdminGatheringListItem) => {
    setEditingGathering(g)
    setIsPanelOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingGathering(null)
    setIsPanelOpen(true)
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`"${title}" 게더링을 취소할까요?`)) {
      deleteGathering(id)
    }
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-bold text-[22px] text-foreground">게더링 관리</h1>
          <button
            id="btn-gathering-add"
            onClick={handleOpenCreate}
            className="px-5 h-11 bg-primary text-white rounded-[12px] font-medium text-sm hover:opacity-90 transition-opacity"
          >
            + 게더링 추가
          </button>
        </div>

        {/* 상태 필터 */}
        <div className="bg-white rounded-[12px] p-4 mb-4 flex gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              id={`filter-status-${s}`}
              onClick={() => setStatusFilter(s)}
              className={`
                px-4 h-9 rounded-full text-sm font-medium transition-all
                ${statusFilter === s
                  ? 'bg-primary text-white'
                  : 'border border-[#E0E0E0] text-[#767676] hover:border-primary'
                }
              `}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F5F5] text-xs text-[#767676] uppercase">
                {['게더링명', '날짜/시간', '장소', '참가비', '신청현황', '상태', '액션'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              )}
              {!isLoading && gatherings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#767676]">
                    게더링이 없습니다.
                  </td>
                </tr>
              )}
              {gatherings.map((g) => {
                const fillRate = g.capacity > 0 ? g.currentApplicants / g.capacity : 0
                return (
                  <tr key={g.id} className="border-t border-[#F0EBE8] hover:bg-[#F5F0EB] transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="font-medium text-[14px] text-[#1A1A1A] hover:text-primary text-left truncate block w-full"
                      >
                        {g.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#767676] whitespace-nowrap">
                      {dayjs(g.date).format('M/D')} {g.startTime.slice(0, 5)}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#767676] max-w-[120px] truncate">
                      {g.locationName ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                      {g.price?.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] whitespace-nowrap">
                          {g.currentApplicants}/{g.capacity}명
                        </span>
                        <div className="w-14 h-1.5 bg-[#F0EBE8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${Math.min(fillRate * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[g.status] ?? ''}`}>
                        {STATUS_LABEL[g.status] ?? g.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-[13px]">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="text-primary hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(g.id, g.title)}
                          className="text-red-500 hover:underline"
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 사이드 패널 */}
      {isPanelOpen && (
        <GatheringFormPanel
          gathering={editingGathering}
          onClose={() => setIsPanelOpen(false)}
          onSuccess={() => {
            setIsPanelOpen(false)
            queryClient.invalidateQueries({ queryKey: ['admin', 'gatherings'] })
          }}
        />
      )}
    </div>
  )
}
