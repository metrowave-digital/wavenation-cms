// src/app/api/tickets/validate/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { code } = await req.json()

  const ticket = await payload.find({
    collection: 'tickets',
    where: { ticketCode: { equals: code } },
  })

  if (ticket.totalDocs === 0) {
    return NextResponse.json({ valid: false })
  }

  const doc = ticket.docs[0]
  if (doc.status !== 'valid') {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({ valid: true, ticket: doc })
}
