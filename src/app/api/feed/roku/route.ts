import { NextResponse } from 'next/server'
import payload from 'payload'

function resolveStreamUrl(item: any): string | null {
  if (item.videoType === 'cloudflare' && item.cloudflareId) {
    return `https://videodelivery.net/${item.cloudflareId}/manifest/video.m3u8`
  }

  if (item.videoType === 'external' && item.externalUrl) {
    return item.externalUrl
  }

  if (item.videoType === 'upload' && item.videoUpload?.url) {
    return item.videoUpload.url
  }

  return null
}

export async function GET() {
  const vod = await payload.find({
    collection: 'vod',
    depth: 2,
    limit: 300,
    sort: '-releaseDate',
  })

  const shortFormVideos = vod.docs.map((item: any) => {
    const streamUrl = resolveStreamUrl(item)

    return {
      id: item.id,
      title: item.title,
      shortDescription: item.description?.slice(0, 200) ?? '',
      thumbnail: item.thumbnail?.url ?? null,
      releaseDate: item.releaseDate ?? null,
      genres: item.genre ?? [],
      tags: item.tags ?? [],
      content: {
        videos: streamUrl
          ? [
              {
                url: streamUrl,
                quality: 'HD',
                videoType: 'HLS',
              },
            ]
          : [],
        duration: item.duration ?? null,
      },
    }
  })

  return NextResponse.json({
    providerName: 'WaveNation',
    language: 'en-US',
    lastUpdated: new Date().toISOString(),
    shortFormVideos,
  })
}
