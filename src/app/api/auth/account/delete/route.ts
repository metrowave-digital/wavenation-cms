import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie')

  if (!cookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 🔥 Correct Payload v3 authentication
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const anonymizedSuffix = `+deleted-${Date.now()}@example.com`

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      status: 'suspended',
      isSuspended: true,
      isLocked: true,
      email: `deleted-${user.id}${anonymizedSuffix}`,
      firstName: 'Deleted',
      lastName: 'User',
      username: `deleted_${user.id}`,
      displayName: 'Deleted User',
      creatorBio: '',
      socialLinks: {},
      website: '',
      subscription: {
        ...user.subscription,
        status: 'canceled',
        cancelAtPeriodEnd: true,
      },
    },
  })

  const res = NextResponse.json({ success: true })

  // Clear cookie
  res.cookies.set('payload-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return res
}
