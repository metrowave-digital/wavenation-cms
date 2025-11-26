import payload from 'payload'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing media id' }, { status: 400 })
  }

  // Ensure ID type is correct
  const media = await payload.findByID({
    collection: 'media',
    id: id as string,
  })

  // Read image path from waveform cache
  const imagePath = media.waveform?.imagePath

  if (!imagePath) {
    return NextResponse.json(
      { error: 'No waveform thumbnail available for this media' },
      { status: 404 },
    )
  }

  // Generate thumbnail via sharp
  const imgBuffer = await sharp(imagePath).resize(800).png().toBuffer()

  return new NextResponse(imgBuffer as any, {
    headers: { 'Content-Type': 'image/png' },
  })
}
