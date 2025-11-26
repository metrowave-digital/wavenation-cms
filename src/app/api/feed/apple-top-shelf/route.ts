import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const [featured, trending, free] = await Promise.all([
    payload.find({
      collection: 'vod',
      where: { featured: { equals: true } },
      sort: '-releaseDate',
      limit: 10,
    }),
    payload.find({
      collection: 'vod',
      where: { trending: { equals: true } },
      sort: '-releaseDate',
      limit: 10,
    }),
    payload.find({
      collection: 'vod',
      where: { isFree: { equals: true } },
      sort: '-releaseDate',
      limit: 10,
    }),
  ])

  const mapItems = (list: any[]) =>
    list.map((item: any) => ({
      id: item.id,
      title: item.title,
      subtitle: item.type,
      description: item.description ?? null,
      thumbnailUrl: item.thumbnail?.url ?? null,
      slug: item.slug,
    }))

  const sections = [
    {
      id: 'featured',
      title: 'Featured on WaveNation',
      items: mapItems(featured.docs),
    },
    {
      id: 'trending',
      title: 'Trending Now',
      items: mapItems(trending.docs),
    },
    {
      id: 'free',
      title: 'Free to Watch',
      items: mapItems(free.docs),
    },
  ]

  return NextResponse.json({
    sections,
    meta: {
      generatedAt: new Date().toISOString(),
    },
  })
}
