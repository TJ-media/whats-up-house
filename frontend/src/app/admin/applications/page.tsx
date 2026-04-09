'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGatheringApi, AdminGatheringListItem } from '@/lib/api/adminGathering'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import dayjs from 'dayjs'

const ATTEND_STATUS = {
  ATTENDED: { label: '참석', style: 'bg-[#E8F5E9] text-[#4CAF50]' },
  CANCELLED: { label: '취소', style: 'bg-[#FDECEA] text-[#C8392B]' },
  PENDING: { label: '신청', style: 'bg-[#F5F5F5] text-[#767676]' },
}

export default function AdminApplicationsPage() {
  const queryClient = useQueryClient()
  const [selectedGatheringId, setSelectedGatheringId] = useState<string>('')

  const { data: gatherings = [] } = useQuery({
    queryKey: ['admin', 'gatherings', 'all-for-applications'],
    queryFn: () => adminGatheringApi.getAll(),
  })

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['admin', 'applications', selectedGatheringId],
    queryFn: () => adminGatheringApi.getApplications(selectedGatheringId),
    enabled: !!selectedGatheringId,
  })

  const selectedGathering = gatherings.find((g) => g.id === selectedGatheringId)

  const { mutate: updateAttendance } = useMutation({
    mutationFn: ({ id, attended }: { id: string; attended: boolean }) =>
      adminGatheringApi.updateAttendance(id, attended),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications', selectedGatheringId] }),
  })

  const { mutate: deleteApplication } = useMutation({
    mutationFn: adminGatheringApi.deleteApplication,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications', selectedGatheringId] }),
  })

  const attendedCount = participants.filter((p) => p.status === 'ATTENDED').length

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-[22px] text-foreground">참가자 관리</h1>
      </div>

      {/* 게더링 선택 */}
      <div className="bg-white rounded-[12px] p-4 mb-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <select
          id="select-gathering"
          value={selectedGatheringId}
          onChange={(e) => setSelectedGatheringId(e.target.value)}
          className="w-[360px] h-11 px-3 border border-[#E0E0E0] rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">게더링을 선택해주세요</option>
          {gatherings.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title} · {dayjs(g.date).format('M월 D일')}
            </option>
          ))}
        </select>

        {selectedGathering && (
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-[#F5F0EB] rounded-full">
              정원 {selectedGathering.capacity}명
            </span>
            <span className="px-3 py-1 bg-[#FDECEA] text-primary rounded-full">
              신청 {selectedGathering.currentApplicants}명
            </span>
            {attendedCount > 0 && (
              <span className="px-3 py-1 bg-[#E8F5E9] text-[#4CAF50] rounded-full">
                참석 {attendedCount}명
              </span>
            )}
          </div>
        )}
      </div>

      {/* 참가자 테이블 */}
      {selectedGatheringId ? (
        <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F5F5] text-xs text-[#767676] uppercase">
                {['이름', '구분', '성별', '나이', '직업', 'MBTI', '연락처', '신청일시', '출석', '액션'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={10} className="py-12 text-center"><LoadingSpinner /></td></tr>
              )}
              {!isLoading && participants.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm text-[#767676]">
                    참가자가 없습니다.
                  </td>
                </tr>
              )}
              {participants.map((p) => {
                const isAttended = p.status === 'ATTENDED'
                const statusInfo = ATTEND_STATUS[p.status as keyof typeof ATTEND_STATUS] ?? ATTEND_STATUS.PENDING
                return (
                  <tr key={p.id} className="border-t border-[#F0EBE8] hover:bg-[#F5F0EB] transition-colors">
                    <td className="px-4 py-3 font-medium text-[14px]">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${p.isGuest ? 'bg-[#FFF3E0] text-[#FF9800]' : 'bg-[#E3F2FD] text-[#1976D2]'}`}>
                        {p.isGuest ? '비회원' : '회원'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#767676]">
                      {p.gender === 'MALE' ? '남' : p.gender === 'FEMALE' ? '여' : '-'}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#767676]">{p.age ?? '-'}</td>
                    <td className="px-4 py-3 text-[13px] text-[#767676]">{p.job ?? '-'}</td>
                    <td className="px-4 py-3">
                      {p.mbti ? (
                        <span className="px-2 py-0.5 bg-[#F0EBE8] text-[#5C4033] rounded-full text-xs">
                          {p.mbti}
                        </span>
                      ) : (
                        <span className="text-[13px] text-[#767676]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#767676]">{p.phone ?? '-'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#767676] whitespace-nowrap">
                      {dayjs(p.createdAt).format('M/D HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        id={`toggle-attend-${p.id}`}
                        onClick={() => updateAttendance({ id: p.id, attended: !isAttended })}
                        className={`
                          relative w-11 h-6 rounded-full transition-colors
                          ${isAttended ? 'bg-[#4CAF50]' : 'bg-[#E0E0E0]'}
                        `}
                      >
                        <span className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
                          ${isAttended ? 'translate-x-5' : 'translate-x-1'}
                        `} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (confirm(`${p.name}님을 참가자 목록에서 삭제할까요?`)) {
                            deleteApplication(p.id)
                          }
                        }}
                        className="text-red-500 text-[13px] hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-[12px] p-16 text-center text-[#767676] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <p className="text-base font-medium mb-2">게더링을 선택해주세요</p>
          <p className="text-sm">위에서 게더링을 선택하면 참가자 목록이 표시돼요.</p>
        </div>
      )}
    </div>
  )
}
