import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import type { CollectionSlug } from 'payload'
import payloadConfig from '@/payload.config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Add all sitemap-enabled collections
const SITEMAP_COLLECTIONS: { slug: CollectionSlug; basePath: string }[] = [
  { slug: 'articles', basePath: '/articles' },
  { slug: 'videos', basePath: '/videos' },
  { slug: 'podcast-episodes', basePath: '/podcasts' },
  { slug: 'tracks', basePath: '/music' },
  { slug: 'vod', basePath: '/watch' },
]

const SITE_URL = process.env.SITE_URL || 'https://wavenation.online'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: payloadConfig })

    let xml = ''

    for (const { slug, basePath } of SITEMAP_COLLECTIONS) {
      const results = await payload.find({
        collection: slug,
        draft: false,
        limit: 500,
      })

      const docs = results.docs as Array<{
        slug?: string
        updatedAt?: string | Date
      }>

      xml += docs
        .filter((doc) => doc.slug)
        .map((doc) => {
          const loc = `${SITE_URL}${basePath}/${doc.slug}`
          const lastmod = doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null

          return lastmod
            ? `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
            : `<url><loc>${loc}</loc></url>`
        })
        .join('')
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xml}
</urlset>`

    return new NextResponse(sitemap, {
      headers: { 'Content-Type': 'application/xml' },
    })
  } catch (err) {
    console.error('❌ Sitemap Error:', err)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
