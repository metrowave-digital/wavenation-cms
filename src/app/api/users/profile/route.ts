// app/api/users/profile/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.match(/payload-token=([^;]+)/)?.[1]
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { user } = await payload.auth({ token })
  if (!user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  const updates = await req.json()

  const updatedUser = await payload.update({
    collection: 'users',
    id: user.id,
    data: updates,
  })

  return NextResponse.json({ user: updatedUser })
}
