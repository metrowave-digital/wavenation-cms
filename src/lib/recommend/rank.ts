type Candidate = {
  id: string
  type: 'post' | 'video' | 'track' | 'podcast' | 'show' | 'channel'
  createdAt: string
  scores: {
    trending: number
    quality: number
    engagement: number
  }
  tags: string[]
  creatorId?: string
}

type UserProfile = {
  interests: string[]
  favoriteCreators: string[]
  lastActive: string
}

export function scoreCandidate(user: UserProfile, c: Candidate): number {
  const now = Date.now()
  const ageHours = (now - new Date(c.createdAt).getTime()) / (1000 * 60 * 60)

  const recencyScore = Math.max(0, 24 - ageHours) / 24 // decay over 24h

  const interestOverlap = c.tags.filter((tag) => user.interests.includes(tag)).length
  const interestScore = interestOverlap / Math.max(1, c.tags.length)

  const creatorBoost = user.favoriteCreators.includes(c.creatorId ?? '') ? 0.2 : 0

  const base =
    0.3 * recencyScore +
    0.3 * c.scores.trending +
    0.2 * c.scores.quality +
    0.2 * c.scores.engagement

  return base + interestScore * 0.3 + creatorBoost
}
