// app/api/events/checkin/generate/route.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { registrationId, eventId, eventType } = await req.json()

  if (!registrationId || !eventId || !eventType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const token = crypto.randomBytes(20).toString('hex')

  const payloadData = {
    registrationId,
    eventId,
    eventType,
    ts: Date.now(),
    token,
  }

  // Your frontend will turn this into a QR code
  const qrString = JSON.stringify(payloadData)

  return NextResponse.json({
    qr: qrString,
    payload: payloadData,
  })
}
