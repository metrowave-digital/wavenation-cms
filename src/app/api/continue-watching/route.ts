import { NextResponse } from 'next/server'

type ProgressEntry = {
  vodId: string
  position: number
  duration?: number
  updatedAt: string
}

const continueWatchingStore: Record<string, ProgressEntry[]> = {}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const entries = continueWatchingStore[userId] ?? []

  return NextResponse.json({
    userId,
    items: entries,
  })
}
