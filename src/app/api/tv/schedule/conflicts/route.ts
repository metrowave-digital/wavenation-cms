// src/app/api/tv/schedule/conflicts/route.ts
import { NextResponse } from 'next/server'
import { findScheduleConflicts } from '@/utils/schedule'

export async function POST(req: Request) {
  const data = await req.json()

  const conflicts = await findScheduleConflicts({
    collection: 'tv-schedule',
    data,
  })

  return NextResponse.json({ conflicts })
}
