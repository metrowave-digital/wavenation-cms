// app/api/dashboard/moderation/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const flaggedUsers = await payload.find({
    collection: 'users',
    where: { 'verified.status': { equals: 'flagged' } },
  })

  const flaggedComments = await payload.find({
    collection: 'comments',
    where: { status: { equals: 'flagged' } },
  })

  return NextResponse.json({
    flaggedUsers: flaggedUsers.docs,
    flaggedComments: flaggedComments.docs,
  })
}
