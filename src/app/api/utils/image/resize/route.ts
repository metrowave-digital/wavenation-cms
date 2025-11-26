// app/api/utils/image/resize/route.ts
import sharp from 'sharp'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('image') as File

  if (!file) {
    return NextResponse.json({ error: 'Missing image file.' }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())

  // resize image using sharp
  const resizedBuffer = await sharp(buf).resize(800).toBuffer()

  // Convert to Uint8Array (NextResponse body type)
  const uint8 = new Uint8Array(resizedBuffer)

  return new NextResponse(uint8, {
    headers: {
      'Content-Type': file.type,
    },
  })
}
