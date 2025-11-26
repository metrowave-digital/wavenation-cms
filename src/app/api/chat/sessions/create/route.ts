import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { userIds, isGroup, groupName } = await req.json()

  if (!Array.isArray(userIds) || userIds.length < 2) {
    return NextResponse.json({ error: 'Need at least two participants' }, { status: 400 })
  }

  // Convert all userIds to numbers
  const numericIds = userIds.map((id: any) => Number(id))

  const session = await payload.create({
    collection: 'chat-sessions',
    data: {
      participants: numericIds,
      isGroup: !!isGroup,
      groupName: isGroup ? groupName : undefined,

      unreadCounts: numericIds.map((id: number) => ({
        user: id, // must be a number
        count: 0,
      })),
    },
  })

  return NextResponse.json({ sessionId: session.id, session })
}
