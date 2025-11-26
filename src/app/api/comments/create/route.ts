import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const comment = await payload.create({
      collection: 'comments',
      data: {
        body: body.body,
        target: body.target,
        parent: body.parent || null,
        user: body.userId || null,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
