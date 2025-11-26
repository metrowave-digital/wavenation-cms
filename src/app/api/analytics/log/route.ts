import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const created = await payload.create({
      collection: 'analyticsMetadata',
      data: body,
    })

    return NextResponse.json({ success: true, event: created })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'log-failed' }, { status: 500 })
  }
}
