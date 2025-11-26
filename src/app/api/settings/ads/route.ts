// app/api/settings/ads/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const ads = await payload.findGlobal({ slug: 'ads-config' })
  return NextResponse.json(ads)
}
