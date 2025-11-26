// app/api/utils/image/thumbnail/route.ts
import sharp from 'sharp'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('image') as File

  if (!file) {
    return NextResponse.json({ error: 'Missing image file.' }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())

  // Generate 300px thumbnail
  const thumbBuffer = await sharp(buf).resize(300).toBuffer()

  // Convert to Uint8Array because Buffer is NOT valid for NextResponse
  const thumbUint8 = new Uint8Array(thumbBuffer)

  return new NextResponse(thumbUint8, {
    headers: {
      'Content-Type': file.type,
    },
  })
}
