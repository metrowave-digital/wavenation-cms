// src/app/api/crawler/ingest-url/route.ts
import { NextResponse } from 'next/server'
import { extract, type ArticleData } from '@extractus/article-extractor'
import { JSDOM } from 'jsdom'

/** Validate URL format */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/** Parse HTML meta tags */
function extractMetadataFromHtml(html: string, url: string) {
  const dom = new JSDOM(html)
  const doc = dom.window.document

  const get = (selector: string): string | null =>
    doc.querySelector(selector)?.getAttribute('content') || null

  return {
    title:
      doc.querySelector('title')?.textContent ||
      get('meta[property="og:title"]') ||
      get('meta[name="twitter:title"]'),

    description:
      get('meta[name="description"]') ||
      get('meta[property="og:description"]') ||
      get('meta[name="twitter:description"]'),

    image: get('meta[property="og:image"]') || get('meta[name="twitter:image"]'),

    favicon:
      doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
      '/favicon.ico',

    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || url,
  }
}

/** Load raw HTML */
async function fetchHTML(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; WaveNationCrawler/1.0; +https://wavenation.media)',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch HTML: ${res.status}`)
  }

  return res.text()
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid or missing URL' }, { status: 400 })
    }

    // ----------------------------
    // 1) Load raw HTML
    // ----------------------------
    const html = await fetchHTML(url)

    // ----------------------------
    // 2) Extract structured metadata
    // ArticleData | null
    // ----------------------------
    const articleData: ArticleData | null = await extract(url)

    // ----------------------------
    // 3) Extract fallback metadata
    // ----------------------------
    const domMeta = extractMetadataFromHtml(html, url)

    // ----------------------------
    // 4) Build final merged metadata
    // SAFE null checks everywhere
    // ----------------------------
    const metadata = {
      url,
      title: articleData?.title || domMeta.title || null,
      description: articleData?.description || domMeta.description || null,
      image: articleData?.image || domMeta.image || null,
      favicon: domMeta.favicon || null,
      canonical: domMeta.canonical || url,

      // articleData fields (safe)
      author: articleData?.author || null,
      published: articleData?.published || null,

      // text + wordcount
      text: articleData?.content || null,
      wordCount: articleData?.content ? articleData.content.split(/\s+/).length : null,
    }

    return NextResponse.json({ success: true, metadata })
  } catch (error) {
    console.error('Crawler error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
