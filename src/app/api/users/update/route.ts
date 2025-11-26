// app/api/users/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: NextRequest) {
  // Manually adapt NextRequest → PayloadRequest (for Payload v3.64)
  const payloadReq = {
    headers: Object.fromEntries(req.headers),
    url: req.url,
    method: req.method,
    cookies: Object.fromEntries(req.cookies),
  } as any

  // Authenticate
  const { user } = await payload.auth({
    req: payloadReq,
    headers: payloadReq.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()

  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: body,
  })

  return NextResponse.json({ user: updated })
}
