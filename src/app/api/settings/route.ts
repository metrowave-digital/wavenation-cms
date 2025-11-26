// app/api/settings/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const settings = await payload.findGlobal({ slug: 'global-settings' })
  return NextResponse.json(settings)
}
