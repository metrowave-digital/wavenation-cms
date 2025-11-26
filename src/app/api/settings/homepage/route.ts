// app/api/settings/homepage/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const homepage = await payload.findGlobal({ slug: 'homepage-settings' })
  return NextResponse.json(homepage)
}
