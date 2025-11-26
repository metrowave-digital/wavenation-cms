// app/api/crawler/social/route.ts
import { unfurl } from 'unfurl.js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { url } = await req.json()
  const data = await unfurl(url)
  return NextResponse.json(data)
}
