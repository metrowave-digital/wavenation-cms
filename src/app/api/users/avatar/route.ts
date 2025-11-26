// app/api/users/avatar/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'
import { Readable } from 'stream'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.match(/payload-token=([^;]+)/)?.[1]
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { user } = await payload.auth({ token })
  if (!user) return NextResponse.json({ error: 'Invalid user' }, { status: 401 })

  const form = await req.formData()
  const file: File | null = form.get('avatar') as unknown as File
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const readable = Readable.from(buffer)

  const uploaded = await payload.create({
    collection: 'media',
    data: {},
    file: {
      data: readable,
      mimetype: file.type,
      filename: file.name,
      size: buffer.length,
    },
  })

  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: { avatar: uploaded.id },
  })

  return NextResponse.json({
    success: true,
    avatar: uploaded,
    user: updated,
  })
}
