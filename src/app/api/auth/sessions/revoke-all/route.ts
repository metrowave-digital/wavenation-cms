// app/api/auth/sessions/revoke-all/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    // 1. Extract token
    const cookie = req.headers.get('cookie')
    const token = cookie?.match(/payload-token=([^;]+)/)?.[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Decode token using Payload secret
    const decoded: any = jwt.verify(token, process.env.PAYLOAD_SECRET!)
    const userId = decoded?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // 3. Load full user
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    // 4. Increment sessionVersion to revoke all tokens
    const nextVersion = (user.sessionVersion || 0) + 1

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        sessionVersion: nextVersion,
      },
    })

    // 5. Clear token cookie
    const res = NextResponse.json({
      success: true,
      sessionVersion: nextVersion,
    })

    res.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
      path: '/',
    })

    return res
  } catch (err) {
    console.error('Session revocation failed:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
