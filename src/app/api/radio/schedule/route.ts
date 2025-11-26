// src/app/api/radio/schedule/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const schedules = await payload.find({
    collection: 'radio-schedule',
    sort: 'startTime',
    limit: 500,
  })

  return NextResponse.json(schedules)
}

export async function POST(req: Request) {
  const data = await req.json()

  const created = await payload.create({
    collection: 'radio-schedule',
    data,
  })

  return NextResponse.json(created)
}
