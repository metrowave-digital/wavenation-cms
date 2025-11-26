import payload from 'payload'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// -------------------------------
// EXPORT METADATA FIELDS HERE
// -------------------------------
export { EnhancedVideoMetadata } from '@/fields/videoMetadata'
export { EnhancedAudioMetadata } from '@/fields/audioMetadata'

// -------------------------------
// Access Control Placeholder
// -------------------------------
export async function ensureCanStream(req: NextRequest, media: any) {
  /**
   * You can plug in your ENTIRE ACCESS LAYER here:
   *
   * - Auth0 JWT decode & user lookup
   * - Payload user session check
   * - Subscription entitlement check
   * - Per-asset purchase check
   * - Age / content rating check
   * - Geolocation restrictions
   */

  // Example scaffold:
  // const token = req.headers.get('authorization')?.replace('Bearer ', '')
  // const user = await decodeUser(token)
  // const isSubscribed = await checkUserSubscription(user)
  // if (!isSubscribed) return false

  return true
}

// -------------------------------
// Stream Route
// -------------------------------
type StreamParams = { params: { id: string } }

export async function GET(req: NextRequest, { params }: StreamParams) {
  const { id } = params

  // 1) Load media doc
  const media = await payload.findByID({
    collection: 'media',
    id,
  })

  // use streamUrl if present; fallback to url
  const sourceUrl = (media as any).streamUrl || media.url

  if (!sourceUrl) {
    return NextResponse.json({ error: 'Media has no streamable URL' }, { status: 400 })
  }

  // 2) Enforce access
  const canStream = await ensureCanStream(req, media)
  if (!canStream) {
    return NextResponse.json({ error: 'Not authorized to stream this media' }, { status: 403 })
  }

  // 3) Mime type
  const mimeType = media.mimeType || 'application/octet-stream'

  // 4) Range header passthrough
  const rangeHeader = req.headers.get('range') || req.headers.get('Range') || undefined

  const upstreamHeaders: HeadersInit = {}
  if (rangeHeader) upstreamHeaders['Range'] = rangeHeader

  // 5) Fetch from S3/R2/CDN origin
  const upstreamResponse = await fetch(sourceUrl as string, {
    method: 'GET',
    headers: upstreamHeaders,
  })

  if (!upstreamResponse.ok) {
    return NextResponse.json({ error: 'Failed to fetch upstream media' }, { status: 502 })
  }

  // 6) Build downstream headers
  const headers = new Headers()
  headers.set('Content-Type', mimeType)

  const hLen = upstreamResponse.headers.get('content-length')
  if (hLen) headers.set('Content-Length', hLen)

  const hRange = upstreamResponse.headers.get('content-range')
  if (hRange) headers.set('Content-Range', hRange)

  headers.set('Accept-Ranges', upstreamResponse.headers.get('accept-ranges') || 'bytes')

  headers.set(
    'Cache-Control',
    upstreamResponse.headers.get('cache-control') || 'public, max-age=0, must-revalidate',
  )

  const status = upstreamResponse.status === 206 && rangeHeader ? 206 : 200

  // 7) Stream to client
  return new NextResponse(upstreamResponse.body, {
    status,
    headers,
  })
}
