// app/api/dashboard/activity/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const activity = await payload.find({
    collection: 'activity-logs',
    sort: '-createdAt',
    limit: 50,
  })

  return NextResponse.json(activity.docs)
}
