// API 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 게더링 타입
export interface GatheringListItem {
  id: string
  title: string
  date: string           // yyyy-MM-dd
  startTime: string      // HH:mm:ss
  endTime: string
  locationName: string
  price: number
  capacity: number
  currentApplicants: number
  thumbnailUrl: string | null
  moodTags: string[] | null
  activityTags: string[] | null
  status: 'RECRUITING' | 'CLOSED' | 'COMPLETED' | 'CANCELLED'
}

export interface GatheringDetail extends GatheringListItem {
  description: string
  howToRun: string[] | null
  locationAddress: string
  photoUrls: string[] | null
  mileageReward: number
  averageRating: number | null
  reviewCount: number
}

// 인증 타입
export interface LoginResponse {
  accessToken: string
  tokenType: string
  userId: string
  nickname: string
  isAdmin: boolean
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  bio: string | null
  gender: string | null
  age: number | null
  job: string | null
  mbti: string | null
  animalType: string | null
  animalColor: string
  animalPose: string
  interests: string[] | null
  mileage: number
  avatarUrl: string | null
}
