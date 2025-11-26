// app/api/settings/toggles/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json()
  const updated = await payload.updateGlobal({
    slug: 'feature-toggles',
    data,
  })

  return NextResponse.json(updated)
}
