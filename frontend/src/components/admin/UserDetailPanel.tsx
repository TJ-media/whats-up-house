'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUserApi, AdminUserListItem } from '@/lib/api/adminUser'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import dayjs from 'dayjs'

const GENDER_LABEL: Record<string, string> = { MALE: '남성', FEMALE: '여성', NONE: '선택 안함' }
const JOB_LABEL: Record<string, string> = {
  STUDENT: '대학생', WORKER: '직장인', FREELANCER: '프리랜서', OTHER: '기타',
}
const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-[#E8F5E9] text-[#4CAF50]',
  SUSPENDED: 'bg-[#FDECEA] text-[#C8392B]',
  ADMIN: 'bg-[#E3F2FD] text-[#1976D2]',
}
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성', SUSPENDED: '정지', ADMIN: '관리자',
}

interface UserDetailPanelProps {
  user: AdminUserListItem
  onClose: () => void
}

export function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  const queryClient = useQueryClient()

  const { data: detail, isLoading } = useQuery({
    queryKey: ['admin', 'users', user.id],
    queryFn: () => adminUserApi.getUserDetail(user.id),
  })

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (suspend: boolean) => adminUserApi.updateStatus(user.id, suspend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', user.id] })
    },
    onError: () => alert('상태 변경 중 오류가 발생했습니다.'),
  })

  const isSuspended = (detail?.accountStatus ?? user.accountStatus) === 'SUSPENDED'
  const isAdmin = (detail?.accountStatus ?? user.accountStatus) === 'ADMIN'

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 w-[440px] h-full bg-white shadow-2xl z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE8]">
          <h2 className="font-bold text-[18px]">회원 상세</h2>
          <button onClick={onClose} className="text-[#767676] text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-16"><LoadingSpinner /></div>
          ) : (
            <>
              {/* 기본 정보 */}
              <div className="px-6 py-5 border-b border-[#F0EBE8]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-[18px] text-[#1A1A1A]">{detail?.nickname}</p>
                    <p className="text-sm text-[#767676]">{detail?.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[detail?.accountStatus ?? 'ACTIVE']}`}>
                    {STATUS_LABEL[detail?.accountStatus ?? 'ACTIVE']}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['성별', GENDER_LABEL[detail?.gender ?? ''] ?? detail?.gender ?? '미입력'],
                    ['나이', detail?.age ? `${detail.age}세` : '미입력'],
                    ['직업', JOB_LABEL[detail?.job ?? ''] ?? detail?.job ?? '미입력'],
                    ['MBTI', detail?.mbti ?? '미입력'],
                    ['마일리지', `${detail?.mileage?.toLocaleString() ?? 0}M`],
                    ['신청 이력', `${user.applicationCount}건`],
                    ['가입일', dayjs(detail?.createdAt).format('YYYY.MM.DD')],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-[#767676] mb-0.5">{label}</p>
                      <p className="font-medium text-[#1A1A1A]">{value}</p>
                    </div>
                  ))}
                </div>

                {detail?.bio && (
                  <div className="mt-3 px-3 py-2.5 bg-[#F5F0EB] rounded-[8px]">
                    <p className="text-xs text-[#767676] mb-1">자기소개</p>
                    <p className="text-sm text-[#1A1A1A]">{detail.bio}</p>
                  </div>
                )}
              </div>

              {/* 신청 이력 */}
              <div className="px-6 py-4">
                <h3 className="font-bold text-[14px] mb-3">신청 이력</h3>
                {(detail?.applicationHistory?.length ?? 0) === 0 ? (
                  <p className="text-sm text-[#767676] py-4 text-center">신청 이력이 없습니다.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {detail?.applicationHistory?.map((app) => (
                      <div key={app.id} className="flex items-center justify-between px-3 py-2.5 bg-[#F5F5F5] rounded-[8px]">
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">
                            {app.gatheringTitle ?? '게더링'}
                          </p>
                          <p className="text-xs text-[#767676]">
                            {dayjs(app.createdAt).format('YYYY.MM.DD')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          app.status === 'ATTENDED' ? 'bg-[#E8F5E9] text-[#4CAF50]' :
                          app.status === 'CANCELLED' ? 'bg-[#FDECEA] text-[#C8392B]' :
                          'bg-[#F5F5F5] text-[#767676]'
                        }`}>
                          {app.status === 'ATTENDED' ? '참석' :
                           app.status === 'CANCELLED' ? '취소' : '신청'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 푸터 - 상태 변경 버튼 (관리자 계정은 변경 불가) */}
        {!isAdmin && (
          <div className="px-6 py-4 border-t border-[#F0EBE8] flex gap-3">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1">닫기</Button>
            <Button
              variant={isSuspended ? 'primary' : 'outlined'}
              type="button"
              isLoading={isPending}
              onClick={() => updateStatus(!isSuspended)}
              className="flex-1"
            >
              {isSuspended ? '계정 활성화' : '계정 정지'}
            </Button>
          </div>
        )}
        {isAdmin && (
          <div className="px-6 py-4 border-t border-[#F0EBE8]">
            <Button variant="ghost" type="button" onClick={onClose} className="w-full">닫기</Button>
          </div>
        )}
      </div>
    </>
  )
}
