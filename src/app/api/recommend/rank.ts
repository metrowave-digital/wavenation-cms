import { NextResponse } from 'next/server'
import payload from 'payload'
import { scoreCandidate } from '@/lib/recommend/rank'

export async function GET(req: Request) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ feed: [] })

  // Load interest profile
  const profileRes = await payload.find({
    collection: 'profiles',
    where: { ownerUser: { equals: user.id } },
    limit: 1,
  })

  const profile = profileRes.docs[0]

  const userInterests = {
    interests: profile?.interests || [],
    favoriteCreators: profile?.favoriteCreators?.map((fc: any) => fc.id) || [],
    lastActive: profile?.lastActive || new Date().toISOString(),
  }

  // Load scored content
  const content = await payload.find({
    collection: 'content-scores',
    limit: 250,
    depth: 2,
  })

  const candidates = content.docs.map((doc: any) => ({
    id: doc.id,
    type: doc.target?.collection,
    createdAt: doc.target?.createdAt,
    scores: {
      trending: doc.trendingScore,
      quality: doc.qualityScore,
      engagement: doc.engagementRate,
    },
    tags: doc.target?.tags || [],
    creatorId: doc.target?.owner || doc.target?.creator || null,
    data: doc.target,
  }))

  const ranked = candidates
    .map((c) => ({
      ...c,
      finalScore: scoreCandidate(userInterests, c),
    }))
    .sort((a, b) => b.finalScore - a.finalScore)

  return NextResponse.json({
    feed: ranked.slice(0, 50),
  })
}
