// app/api/users/[id]/is-following/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ follows: false })

  const targetId = params.id

  const result = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: { equals: targetId },
      kind: { equals: 'user' },
    },
    limit: 1,
  })

  return NextResponse.json({ follows: result.totalDocs > 0 })
}
