'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminUserApi, AdminUserListItem } from '@/lib/api/adminUser'
import { UserDetailPanel } from '@/components/admin/UserDetailPanel'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useForm } from 'react-hook-form'

const GENDER_LABEL: Record<string, string> = { MALE: '남', FEMALE: '여', NONE: '-' }
const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-[#E8F5E9] text-[#4CAF50]',
  SUSPENDED: 'bg-[#FDECEA] text-[#C8392B]',
  ADMIN: 'bg-[#E3F2FD] text-[#1976D2]',
}
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성', SUSPENDED: '정지', ADMIN: '관리자',
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', keyword],
    queryFn: () => adminUserApi.getUsers(keyword || undefined),
  })

  const users: AdminUserListItem[] = data?.content ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(searchInput)
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-bold text-[22px] text-foreground">회원 관리</h1>
          <span className="text-sm text-[#767676]">총 {data?.totalElements ?? 0}명</span>
        </div>

        {/* 검색 */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-[12px] p-4 mb-4 flex gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
        >
          <input
            id="input-user-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="닉네임 또는 이메일로 검색"
            className="flex-1 h-11 px-4 border border-[#E0E0E0] rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-5 h-11 bg-primary text-white rounded-[12px] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            검색
          </button>
          {keyword && (
            <button
              type="button"
              onClick={() => { setKeyword(''); setSearchInput('') }}
              className="px-4 h-11 border border-[#E0E0E0] text-[#767676] rounded-[12px] text-sm hover:border-primary transition-colors"
            >
              초기화
            </button>
          )}
        </form>

        {/* 테이블 */}
        <div className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F5F5] text-xs text-[#767676] uppercase">
                {['닉네임', '이메일', '성별/나이', '직업', 'MBTI', '신청수', '마일리지', '상태', '상세'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={9} className="py-12 text-center"><LoadingSpinner /></td></tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm text-[#767676]">
                    {keyword ? `"${keyword}" 검색 결과가 없습니다.` : '등록된 회원이 없습니다.'}
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[#F0EBE8] hover:bg-[#F5F0EB] transition-colors">
                  <td className="px-4 py-3 font-medium text-[14px]">{u.nickname}</td>
                  <td className="px-4 py-3 text-[13px] text-[#767676] max-w-[160px] truncate">{u.email}</td>
                  <td className="px-4 py-3 text-[13px] text-[#767676]">
                    {GENDER_LABEL[u.gender ?? ''] ?? '-'} / {u.age ? `${u.age}세` : '-'}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#767676]">{u.job ?? '-'}</td>
                  <td className="px-4 py-3">
                    {u.mbti && (
                      <span className="px-2 py-0.5 bg-[#F0EBE8] text-[#5C4033] rounded-full text-xs">
                        {u.mbti}
                      </span>
                    )}
                    {!u.mbti && <span className="text-[13px] text-[#767676]">-</span>}
                  </td>
                  <td className="px-4 py-3 text-[13px]">{u.applicationCount}건</td>
                  <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                    {u.mileage.toLocaleString()}M
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[u.accountStatus] ?? ''}`}>
                      {STATUS_LABEL[u.accountStatus] ?? u.accountStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="text-primary text-[13px] hover:underline"
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 회원 상세 패널 */}
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null)
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
          }}
        />
      )}
    </div>
  )
}
