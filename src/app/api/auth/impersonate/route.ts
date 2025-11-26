// app/api/auth/impersonate/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const IMPERSONATE_JWT_SECRET = process.env.IMPERSONATE_JWT_SECRET || 'change-me'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie')

  if (!cookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 🔥 Correct Payload v3 authentication
  const { user: adminUser } = await payload.auth({
    headers: req.headers,
  })

  if (!adminUser) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  if (adminUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { targetUserId } = await req.json()
  if (!targetUserId) {
    return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 })
  }

  const targetUser = await payload.findByID({
    collection: 'users',
    id: targetUserId,
  })

  if (!targetUser) {
    return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
  }

  // 🔥 Create impersonation token
  const impersonationToken = jwt.sign(
    {
      sub: targetUser.id,
      adminId: adminUser.id,
      role: targetUser.role,
      type: 'impersonation',
    },
    IMPERSONATE_JWT_SECRET,
    { expiresIn: '2h' },
  )

  const res = NextResponse.json({
    success: true,
    impersonatingUserId: targetUser.id,
  })

  // 🔥 Set impersonation cookie
  res.cookies.set('impersonate-token', impersonationToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })

  return res
}
