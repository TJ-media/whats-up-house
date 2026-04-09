'use client'

interface PaginationProps {
  currentPage: number   // 0-indexed
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }
    const pages: (number | 'ellipsis')[] = []
    if (currentPage <= 3) {
      pages.push(0, 1, 2, 3, 4, 'ellipsis', totalPages - 1)
    } else if (currentPage >= totalPages - 4) {
      pages.push(0, 'ellipsis', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1)
    } else {
      pages.push(0, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages - 1)
    }
    return pages
  }

  const pages = getPageNumbers()

  const btnClass = "w-8 h-8 flex items-center justify-center rounded-full text-[#767676] hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* 맨 앞 << */}
      <button
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        className={btnClass}
        aria-label="첫 페이지"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M11 1L6 6L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 이전 < */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={btnClass}
        aria-label="이전 페이지"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 페이지 번호 */}
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-[13px] text-[#767676]">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium transition-all ${
              p === currentPage
                ? 'bg-primary text-white'
                : 'text-[#767676] hover:text-primary'
            }`}
          >
            {(p as number) + 1}
          </button>
        )
      )}

      {/* 다음 > */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={btnClass}
        aria-label="다음 페이지"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 맨 뒤 >> */}
      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className={btnClass}
        aria-label="마지막 페이지"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 1L11 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
