// app/api/utils/ai/extract/route.ts
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { text } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages: [
      {
        role: 'user',
        content: `Extract all useful metadata from this content:\n\n${text}`,
      },
    ],
  })

  return NextResponse.json({
    metadata: completion.choices[0].message.content,
  })
}
