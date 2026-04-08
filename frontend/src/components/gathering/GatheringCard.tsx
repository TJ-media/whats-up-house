import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { GatheringListItem } from '@/lib/api/types'

interface GatheringCardProps {
  gathering: GatheringListItem
}

export default function GatheringCard({ gathering }: GatheringCardProps) {
  const {
    id, title, startTime, locationName, price,
    capacity, currentApplicants, thumbnailUrl,
    status, moodTags,
  } = gathering

  return (
    <Link href={`/gatherings/${id}`}>
      <div className="rounded-card bg-card shadow-sm overflow-hidden">
        {/* 썸네일 */}
        <div className="relative w-full aspect-video bg-tag-bg">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-tag-bg" />
          )}
          <div className="absolute top-3 left-3">
            <Badge variant={status} />
          </div>
        </div>

        {/* 내용 */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="flex flex-col gap-1 text-sm text-tag-text mb-3">
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>{startTime.slice(0, 5)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span>{locationName}</span>
            </div>
          </div>

          {moodTags && moodTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {moodTags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-tag-bg text-tag-text px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">{price.toLocaleString()}원</span>
            <span className="text-xs text-tag-text">{currentApplicants}/{capacity}명</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
