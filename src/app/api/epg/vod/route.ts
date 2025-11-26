// src/app/api/epg/vod/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const genres = url.searchParams.get('genre')?.split(',') ?? null
  const categories = url.searchParams.get('category')?.split(',') ?? null
  const types = url.searchParams.get('type')?.split(',') ?? null

  const isFree = url.searchParams.get('isFree')
  const featured = url.searchParams.get('featured')
  const trending = url.searchParams.get('trending')
  const recommended = url.searchParams.get('recommended')

  const search = url.searchParams.get('search')

  const where: any = {}

  /** Genre filter */
  if (genres) {
    where.genre = { in: genres }
  }

  /** Category filter */
  if (categories) {
    where.categories = {
      in: categories,
    }
  }

  /** Type filter */
  if (types) {
    where.type = { in: types }
  }

  /** Boolean filters */
  if (isFree !== null) where.isFree = { equals: isFree === 'true' }
  if (featured !== null) where.featured = { equals: featured === 'true' }
  if (trending !== null) where.trending = { equals: trending === 'true' }
  if (recommended !== null) where.recommended = { equals: recommended === 'true' }

  /** Text search */
  if (search) {
    where.or = [{ title: { like: search } }, { description: { like: search } }]
  }

  const vod = await payload.find({
    collection: 'vod',
    depth: 2,
    where: Object.keys(where).length ? where : undefined,
    sort: '-releaseDate',
    limit: 300,
  })

  const items = vod.docs.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description ?? null,
    type: item.type,
    isFree: item.isFree,
    duration: item.duration ?? null,
    releaseDate: item.releaseDate ?? null,
    status: item.status,
    genre: item.genre ?? [],
    categories: item.categories ?? [],
    featured: item.featured ?? false,
    trending: item.trending ?? false,
    recommended: item.recommended ?? false,
    thumbnailUrl:
      item.thumbnail?.url ?? (typeof item.thumbnail === 'string' ? item.thumbnail : null),
    videoType: item.videoType,
    cloudflareId: item.cloudflareId ?? null,
    externalUrl: item.externalUrl ?? null,
  }))

  return NextResponse.json({
    channel: {
      id: 'wavenation-vod',
      name: 'WaveNation On Demand',
      items,
    },
    filtersUsed: {
      genres,
      categories,
      types,
      isFree,
      featured,
      trending,
      recommended,
      search,
    },
    meta: {
      count: items.length,
      generatedAt: new Date().toISOString(),
    },
  })
}
