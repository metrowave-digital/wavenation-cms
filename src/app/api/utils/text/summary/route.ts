// src/app/api/utils/text/summary/route.ts
import { NextResponse } from 'next/server'

// Prevent Next.js from prerendering or executing at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    // Lazy-load OpenAI so it does NOT run during build
    const OpenAI = (await import('openai')).default

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.log('[AI Summary] Missing OPENAI_API_KEY (runtime)')
      return NextResponse.json({ error: 'AI is not configured' }, { status: 500 })
    }

    const client = new OpenAI({ apiKey })

    const { text } = await req.json()

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: `Summarize this text in 3–4 sentences. Text: ${text}`,
    })

    return NextResponse.json({ summary: response.output_text })
  } catch (error) {
    console.error('❌ AI Summary Route Error:', error)
    return NextResponse.json({ error: 'Summary generation failed' }, { status: 500 })
  }
}
