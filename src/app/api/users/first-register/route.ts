// src/app/api/users/first-register/route.ts

import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { getPayloadClient } from '@/payload/payloadClient'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  console.log('---- /api/users/first-register START ----')

  const contentType = req.headers.get('content-type') || ''
  const clone = req.clone()
  let body: any = null

  // ------------------------------------------------------------
  // CASE 1 — JSON (Auth0 or frontend)
  // ------------------------------------------------------------
  if (contentType.includes('application/json')) {
    try {
      body = await req.json()
      console.log('[first-register] Parsed JSON:', body)
      return handleRegister(body)
    } catch {
      console.error('[first-register] JSON parse failed')
      const raw = await clone.text()
      console.error('[first-register] RAW JSON BODY:', raw)

      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
  }

  // ------------------------------------------------------------
  // CASE 2 — multipart/form-data (Payload Admin Panel)
  // ------------------------------------------------------------
  if (contentType.includes('multipart/form-data')) {
    try {
      const form = await req.formData()
      const raw = form.get('_payload')

      if (typeof raw !== 'string') {
        return NextResponse.json({ error: 'Missing _payload in form-data' }, { status: 400 })
      }

      body = JSON.parse(raw)
      console.log('[first-register] Parsed FORM-DATA _payload:', body)

      return handleRegister(body)
    } catch (err) {
      console.error('[first-register] Failed parsing form-data:', err)
      return NextResponse.json({ error: 'Invalid form-data' }, { status: 400 })
    }
  }

  // ------------------------------------------------------------
  // Unsupported Content Type
  // ------------------------------------------------------------
  return NextResponse.json(
    { error: 'Unsupported Content-Type. Expected JSON or multipart/form-data.' },
    { status: 415 },
  )
}

// ============================================================
// REGISTER HANDLER (Shared for JSON + FormData)
// ============================================================

async function handleRegister(body: any) {
  const payload = await getPayloadClient()

  const { auth0Id, email, firstName, lastName, displayName, avatar } = body

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  // ------------------------------------------------------------
  // Check if user already exists
  // ------------------------------------------------------------
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log('[first-register] Existing user found')
    return NextResponse.json({
      ok: true,
      user: existing.docs[0],
      alreadyRegistered: true,
    })
  }

  // ------------------------------------------------------------
  // Optional avatar processing
  // ------------------------------------------------------------
  let avatarId: number | null = null

  if (avatar) {
    try {
      console.log('[first-register] Downloading avatar:', avatar)

      const res = await fetch(avatar)
      const buffer = Buffer.from(await res.arrayBuffer())

      const tmpPath = path.join(process.cwd(), 'tmp', `avatar-${Date.now()}.jpg`)
      await fs.mkdir(path.dirname(tmpPath), { recursive: true })
      await fs.writeFile(tmpPath, buffer)

      const uploaded = await payload.create({
        collection: 'media',
        filePath: tmpPath,
        data: { alt: `${displayName ?? email}'s avatar` },
        draft: true,
      } as any)

      avatarId = uploaded.id
      console.log('[first-register] Avatar uploaded, ID:', avatarId)
    } catch (err) {
      console.warn('[first-register] Avatar upload failed:', err)
    }
  }

  // ------------------------------------------------------------
  // Create user
  // ------------------------------------------------------------
  const newUser = await payload.create({
    collection: 'users',
    data: {
      firstName: firstName ?? 'New',
      lastName: lastName ?? 'User',

      username: undefined,
      displayName: displayName ?? `${firstName ?? 'New'} ${lastName ?? 'User'}`.trim(),

      email,

      // IMPORTANT:
      // - If coming from Payload Admin Panel, include password
      // - If coming from Auth0 (JSON), password undefined (ignored)
      ...(body.password ? { password: body.password } : {}),

      authProvider: {
        provider: auth0Id ? 'auth0' : 'local',
        auth0Id: auth0Id ?? null,
        lastLoginProvider: auth0Id ? 'auth0' : 'local',
      },

      avatar: avatarId,
      role: 'contributor',

      verified: {
        status: 'unverified',
        badge: false,
      },
    },
    draft: true,
  } as any)

  console.log('[first-register] NEW USER CREATED:', newUser.id)

  return NextResponse.json({
    ok: true,
    user: newUser,
    alreadyRegistered: false,
  })
}
