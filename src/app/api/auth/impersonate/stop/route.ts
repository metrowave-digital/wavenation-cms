// app/api/auth/impersonate/stop/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('impersonate-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })
  return res
}
