// app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie')
    const token = cookie?.match(/payload-token=([^;]+)/)?.[1]

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Verify JWT with Payload secret
    const decoded: any = jwt.verify(token, process.env.PAYLOAD_SECRET!)

    // Extract user ID from token
    const userId = decoded?.user?.id
    if (!userId) {
      return NextResponse.json({ user: null })
    }

    // Fetch full user from Payload
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('auth/me failed:', error)
    return NextResponse.json({ user: null })
  }
}
