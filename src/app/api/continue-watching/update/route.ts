import { NextResponse } from 'next/server'

type ProgressEntry = {
  vodId: string
  position: number
  duration?: number
  updatedAt: string
}

const continueWatchingStore: Record<string, ProgressEntry[]> = {}

export async function POST(req: Request) {
  const body = await req.json()
  const { userId, vodId, position, duration } = body

  if (!userId || !vodId || typeof position !== 'number') {
    return NextResponse.json({ error: 'Missing userId, vodId, or position' }, { status: 400 })
  }

  const list = continueWatchingStore[userId] ?? []

  const existingIndex = list.findIndex((e) => e.vodId === vodId)
  const entry: ProgressEntry = {
    vodId,
    position,
    duration,
    updatedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    list[existingIndex] = entry
  } else {
    list.push(entry)
  }

  continueWatchingStore[userId] = list

  return NextResponse.json({ status: 'ok', userId, entry })
}
