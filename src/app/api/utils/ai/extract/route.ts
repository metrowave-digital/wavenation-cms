// src/app/api/utils/ai/extract/route.ts
import { NextResponse } from 'next/server'

// Prevent Next.js from prerendering this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    // Lazy import — prevents OpenAI from loading at build time
    const OpenAI = (await import('openai')).default

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.log('AI Extract: Missing OPENAI_API_KEY at runtime')
      return NextResponse.json({ error: 'AI extract is not configured' }, { status: 500 })
    }

    const client = new OpenAI({ apiKey })

    const { text } = await req.json()

    const result = await client.responses.create({
      model: 'gpt-4o-mini',
      input: text,
    })

    return NextResponse.json({ result })
  } catch (error) {
    console.error('❌ AI Extract Route Runtime Error:', error)
    return NextResponse.json({ error: 'AI extract failed' }, { status: 500 })
  }
}
