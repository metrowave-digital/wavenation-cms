// app/api/search/vod/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  const vod = await payload.find({
    collection: 'vod',
    where: { title: { contains: q } },
  })
  return NextResponse.json(vod.docs)
}
