// src/app/api/vod/access/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { vodId } = await req.json()

  if (!vodId) {
    return NextResponse.json({ error: 'Missing vodId' }, { status: 400 })
  }

  const vod: any = await payload.findByID({
    collection: 'vod',
    id: vodId,
  })

  if (!vod) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Free content → allow
  if (vod.isFree) {
    return NextResponse.json({ access: true, reason: 'free-content' })
  }

  const user: any = await payload.auth(req)

  if (!user) {
    return NextResponse.json({ access: false, reason: 'not-authenticated' })
  }

  if (user.subscription?.status === 'active') {
    return NextResponse.json({ access: true, reason: 'subscription-active' })
  }

  return NextResponse.json({
    access: false,
    reason: 'subscription-required',
  })
}
