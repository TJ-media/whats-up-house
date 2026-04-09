export const ANIMAL_TYPES = ['FOX', 'CAT', 'RABBIT', 'BEAR', 'DUCK', 'PANDA', 'DOG', 'OTTER'] as const
export type AnimalType = typeof ANIMAL_TYPES[number]

export const ANIMAL_EMOJI: Record<AnimalType, string> = {
  FOX: '🦊',
  CAT: '🐱',
  RABBIT: '🐰',
  BEAR: '🐻',
  DUCK: '🦆',
  PANDA: '🐼',
  DOG: '🐶',
  OTTER: '🦦',
}

export function getRandomAnimalType(): AnimalType {
  return ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)]
}

export function getAnimalEmoji(animalType: string | null | undefined): string {
  if (!animalType) return '🌿'
  return ANIMAL_EMOJI[animalType as AnimalType] ?? '🌿'
}
