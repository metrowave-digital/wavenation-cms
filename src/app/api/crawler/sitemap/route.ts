// src/app/api/crawler/sitemap/route.ts

import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import type { CollectionSlug } from 'payload'
import payloadConfig from '@/payload.config'

// 🚫 Do NOT let Next.js prerender this at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 👉 Which collections to include in the sitemap
const SITEMAP_COLLECTIONS: { slug: CollectionSlug; basePath: string }[] = [
  { slug: 'articles', basePath: '/articles' },
  { slug: 'videos', basePath: '/videos' },
  { slug: 'tracks', basePath: '/music' },
  { slug: 'podcast-episodes', basePath: '/podcasts' },
  { slug: 'vod', basePath: '/watch' },
]

// 👉 Base URL (you can set SITE_URL in env for flexibility)
const SITE_URL = process.env.SITE_URL ?? 'https://wavenation.media'

export async function GET() {
  try {
    // ✅ Correct: pass actual config, NOT a dynamic import/promise
    const payload = await getPayloadHMR({
      config: payloadConfig,
    })

    let allUrls = ''

    for (const { slug, basePath } of SITEMAP_COLLECTIONS) {
      const result = await payload.find({
        collection: slug,
        draft: false,
        limit: 1000,
      })

      // TS: Result docs are union types; we only care that they *may* have slug + updatedAt
      const docs = result.docs as Array<{
        slug?: string
        updatedAt?: string | Date
      }>

      const urlsForCollection = docs
        .filter((doc) => !!doc.slug)
        .map((doc) => {
          const loc = `${SITE_URL}${basePath}/${doc.slug}`

          const lastmod =
            doc.updatedAt instanceof Date
              ? doc.updatedAt.toISOString()
              : doc.updatedAt
                ? new Date(doc.updatedAt).toISOString()
                : null

          if (lastmod) {
            return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
          }

          return `<url><loc>${loc}</loc></url>`
        })
        .join('')

      allUrls += urlsForCollection
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (err) {
    console.error('❌ Sitemap generation failed:', err)
    return new NextResponse('Sitemap generation error', { status: 500 })
  }
}
