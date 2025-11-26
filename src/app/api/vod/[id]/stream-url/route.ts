// src/app/api/vod/[id]/stream-url/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const vod: any = await payload.findByID({
    collection: 'vod',
    id: params.id,
  })

  if (!vod) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  /** 1. Cloudflare Stream */
  if (vod.videoType === 'cloudflare' && vod.cloudflareId) {
    return NextResponse.json({
      type: 'cloudflare',
      streamUrl: `https://videodelivery.net/${vod.cloudflareId}/manifest/video.m3u8`,
      dashboardUrl: `https://dash.cloudflare.com/stream/${vod.cloudflareId}`,
    })
  }

  /** 2. File Upload (Payload Media) */
  if (vod.videoType === 'upload' && vod.videoUpload?.url) {
    return NextResponse.json({
      type: 'upload',
      streamUrl: vod.videoUpload.url,
    })
  }

  /** 3. External URL */
  if (vod.videoType === 'external' && vod.externalUrl) {
    return NextResponse.json({
      type: 'external',
      streamUrl: vod.externalUrl,
    })
  }

  return NextResponse.json({ error: 'No valid stream source' }, { status: 400 })
}
