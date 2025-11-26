// src/app/api/crawler/metadata/route.ts

import { NextResponse } from 'next/server'
import { extractMetadata } from '@/utils/media/extractMetadata'

type MetadataRequestBody = {
  filePath?: string
  url?: string
}

// Ensure Node runtime (fluent-ffmpeg is not edge-compatible)
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MetadataRequestBody

    if (!body.filePath && !body.url) {
      return NextResponse.json({ error: 'Missing filePath or url' }, { status: 400 })
    }

    // For now we assume local files; if you’re downloading URLs, plug that in here.
    const target = body.filePath ?? body.url!

    const metadata = await extractMetadata(target)

    return NextResponse.json({ ok: true, metadata })
  } catch (error: any) {
    console.error('[crawler/metadata] Error extracting metadata', error)
    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? 'Failed to extract metadata',
      },
      { status: 500 },
    )
  }
}
