// app/api/search/profiles/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  const profiles = await payload.find({
    collection: 'profiles',
    where: { displayName: { contains: q } },
  })
  return NextResponse.json(profiles.docs)
}
