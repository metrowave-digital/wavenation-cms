// app/api/utils/text/summary/route.ts
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { text } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: `Summarize: ${text}` }],
  })

  return NextResponse.json({
    summary: completion.choices[0].message.content,
  })
}
