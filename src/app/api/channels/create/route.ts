import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const user = (req as any).user
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()

    const channel = await payload.create({
      collection: 'creator-channels',
      data: {
        owner: user.id,
        name: body.name,
        bio: body.bio || '',
        profileImage: body.profileImage || null,
        bannerImage: body.bannerImage || null,
        links: body.links || {},
        status: 'active',
      },
    })

    return NextResponse.json({ success: true, channel })
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
