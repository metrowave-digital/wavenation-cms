// src/app/api/radio/schedule/conflicts/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import { findScheduleConflicts } from '@/utils/schedule'

export async function POST(req: Request) {
  const data = await req.json()

  const conflicts = await findScheduleConflicts({
    collection: 'radio-schedule',
    data,
  })

  return NextResponse.json({ conflicts })
}
