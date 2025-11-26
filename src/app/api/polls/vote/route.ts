import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const MAX_VOTES_PER_HOUR_PER_DEVICE = 10

function hmac(value: string | null | undefined) {
  if (!value) return ''
  const secret = process.env.POLL_FRAUD_SECRET || 'fallback-poll-secret'
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

export async function POST(req: NextRequest) {
  const { pollId, optionIndex, userId, fingerprint } = await req.json()

  if (!pollId || optionIndex === undefined) {
    return NextResponse.json({ error: 'missing pollId or optionIndex' }, { status: 400 })
  }

  // 🔎 Normalize “IP”
  const ipRaw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || ''
  const userAgent = req.headers.get('user-agent') || ''

  // 🔐 Hash identifiers so we don’t work with raw personally identifiable data
  const ipHash = hmac(ipRaw)
  const fingerprintHash = hmac(fingerprint)

  // 🕒 Rate limit window (last 1 hour)
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()

  // 1) Check for duplicate vote on this poll
  const duplicateCheck = await payload.find({
    collection: 'poll-votes',
    limit: 1,
    where: {
      poll: { equals: pollId },
      or: [
        userId ? { user: { equals: userId } } : { user: { exists: false } }, // if no user, skip this path
        { ipHash: { equals: ipHash } },
        { fingerprintHash: { equals: fingerprintHash } },
      ],
    },
  })

  if (duplicateCheck.totalDocs > 0) {
    return NextResponse.json({ error: 'already_voted' }, { status: 409 })
  }

  // 2) Rate-limit by IP / fingerprint over the last hour (global across polls)
  const rateCheck = await payload.find({
    collection: 'poll-votes',
    where: {
      and: [
        {
          or: [{ ipHash: { equals: ipHash } }, { fingerprintHash: { equals: fingerprintHash } }],
        },
        {
          createdAt: { greater_than_equal: oneHourAgo },
        },
      ],
    },
    limit: MAX_VOTES_PER_HOUR_PER_DEVICE + 1,
  })

  const recentVotes = rateCheck.totalDocs
  const isRateLimited = recentVotes >= MAX_VOTES_PER_HOUR_PER_DEVICE

  // Simple risk scoring
  let riskScore = 0
  if (recentVotes > 3) riskScore += 10
  if (recentVotes > 5) riskScore += 20
  if (isRateLimited) riskScore += 50

  // If you want hard block on rate limit:
  if (isRateLimited) {
    return NextResponse.json(
      {
        error: 'rate_limited',
        detail: 'Too many votes from this device recently.',
      },
      { status: 429 },
    )
  }

  // 3) Create the vote record (even if moderate risk, we store it)
  const vote = await payload.create({
    collection: 'poll-votes',
    data: {
      poll: pollId,
      user: userId || null,
      optionIndex,
      ip: ipRaw || null,
      userAgent,
      fingerprint: fingerprint || null,
      ipHash,
      fingerprintHash,
      riskScore,
      blocked: false, // you could flip true if riskScore exceeds some threshold
    },
  })

  return NextResponse.json({ success: true, vote })
}
