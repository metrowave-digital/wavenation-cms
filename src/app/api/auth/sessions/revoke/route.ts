// app/api/auth/sessions/revoke/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.match(/payload-token=([^;]+)/)?.[1]
  if (!token) {
    return NextResponse.json({ error: 'No active session' }, { status: 400 })
  }

  const res = NextResponse.json({ success: true })

  // Clear cookie – front-end should also clear any local storage tokens if used
  res.cookies.set('payload-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return res
}
