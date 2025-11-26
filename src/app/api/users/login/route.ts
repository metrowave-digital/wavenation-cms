// src/app/api/users/login/route.ts

import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload/payloadClient'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const payload = await getPayloadClient()

  const contentType = req.headers.get('content-type') || ''
  const clone = req.clone()
  let body: any = null

  // -------------------------
  // JSON LOGIN (frontend)
  // -------------------------
  if (contentType.includes('application/json')) {
    try {
      body = await req.json()
    } catch {
      const raw = await clone.text()
      console.error('[login] Bad JSON:', raw)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
  }

  // -------------------------
  // FORM-DATA LOGIN (Payload Admin)
  // -------------------------
  else if (contentType.includes('multipart/form-data')) {
    try {
      const form = await req.formData()
      const raw = form.get('_payload')
      if (typeof raw !== 'string') {
        return NextResponse.json({ error: 'Missing _payload' }, { status: 400 })
      }
      body = JSON.parse(raw)
    } catch (err) {
      console.error('[login] Form parse failed:', err)
      return NextResponse.json({ error: 'Invalid form-data' }, { status: 400 })
    }
  } else {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  }

  // -------------------------
  // AUTHENTICATE USER
  // -------------------------
  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email: body.email,
        password: body.password,
      },
    })

    // Extract token + expiration
    const { token, exp } = result

    // -------------------------
    // SET SESSION COOKIE
    // -------------------------
    const res = NextResponse.json(result)

    res.headers.append(
      'Set-Cookie',
      `payload-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${exp}; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`,
    )

    return res
  } catch (e: any) {
    console.error('[login] Login error:', e)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
