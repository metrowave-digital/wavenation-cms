import { NextResponse } from 'next/server'
import payload from 'payload'
import { scoreCandidate } from '@/lib/recommend/rank'

function toUserProfile(doc: any) {
  return {
    interests: doc.interests || [],
    favoriteCreators: doc.favoriteCreators?.map((c: any) => c.id) || [],
    lastActive: doc.updatedAt || new Date().toISOString(),
  }
}

export async function GET(req: Request) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ feed: [] })

  // 1. Load profile
  const profileResult = await payload.find({
    collection: 'profiles',
    where: { user: { equals: user.id } },
    limit: 1,
  })

  const profileDoc = profileResult.docs[0]
  if (!profileDoc) return NextResponse.json({ feed: [] })

  const userProfile = toUserProfile(profileDoc)

  // 2. Get content scores
  const scores = await payload.find({
    collection: 'content-scores',
    limit: 200,
    depth: 2,
  })

  // 3. Build candidates
  const candidates = scores.docs.map((doc: any) => ({
    id: doc.id,
    type: doc.target?.collection,
    createdAt: doc.target?.createdAt,
    scores: {
      trending: doc.trendingScore,
      quality: doc.qualityScore,
      engagement: doc.engagementRate,
    },
    tags: [], // TODO
    creatorId: doc.target?.creator || doc.target?.owner || null,
    data: doc.target,
  }))

  // 4. Score + rank
  const ranked = candidates
    .map((item) => ({
      ...item,
      finalScore: scoreCandidate(userProfile, item),
    }))
    .sort((a, b) => b.finalScore - a.finalScore)

  // 5. Return feed
  return NextResponse.json({
    feed: ranked.slice(0, 50),
  })
}
