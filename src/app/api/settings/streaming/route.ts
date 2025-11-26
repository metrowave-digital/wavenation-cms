// app/api/settings/streaming/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const settings = await payload.findGlobal({ slug: 'streaming-config' })
  return NextResponse.json(settings)
}
