// app/api/events/checkin/generate/route.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { registrationId } = await req.json()

  const token = crypto.randomBytes(20).toString('hex')

  const qrPayload = {
    registrationId,
    token,
    ts: Date.now(),
  }

  return NextResponse.json({
    qr: JSON.stringify(qrPayload),
  })
}
