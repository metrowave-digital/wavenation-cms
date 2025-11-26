// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import crypto from 'crypto'

const auth0Domain = process.env.AUTH0_DOMAIN!
const auth0Audience = process.env.AUTH0_API_AUDIENCE!

const JWKS = createRemoteJWKSet(new URL(`https://${auth0Domain}/.well-known/jwks.json`))

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Missing Auth0 token' }, { status: 400 })
    }

    // 1) Verify Auth0 JWT
    const { payload: jwtPayload } = await jwtVerify(token, JWKS, {
      issuer: `https://${auth0Domain}/`,
      audience: auth0Audience,
    })

    const auth0Sub = String(jwtPayload.sub ?? '')
    if (!auth0Sub) {
      return NextResponse.json({ error: 'Auth0 token missing sub' }, { status: 400 })
    }

    const email = (jwtPayload.email as string | undefined) ?? `${auth0Sub}@auth0.local`
    const firstName = (jwtPayload.given_name as string | undefined) ?? 'Auth'
    const lastName = (jwtPayload.family_name as string | undefined) ?? 'User'
    const username = email.split('@')[0] || auth0Sub.replace('|', '-') || `auth0-${Date.now()}`

    // 2) Find existing user by Auth0 ID
    const existing = await payload.find({
      collection: 'users',
      where: {
        'authProvider.auth0Id': { equals: auth0Sub },
      },
      limit: 1,
      overrideAccess: true,
    })

    let user = existing.docs[0]

    // 3) If not found, create a new user (cast data to any to avoid v3 strictness)
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex')

      user = await payload.create({
        collection: 'users',
        overrideAccess: true,
        draft: false,
        data: {
          email,
          password: randomPassword,
          firstName,
          lastName,
          username,
          role: 'viewer',
          status: 'active',
          authProvider: {
            provider: 'auth0',
            auth0Id: auth0Sub,
            lastLoginProvider: 'auth0',
          },
          // let all other required fields fall back to defaults / hooks
        } as any,
      })
    } else {
      // Optional: keep authProvider in sync
      user = await payload.update({
        collection: 'users',
        id: user.id,
        overrideAccess: true,
        data: {
          authProvider: {
            ...(user.authProvider || {}),
            provider: 'auth0',
            auth0Id: auth0Sub,
            lastLoginProvider: 'auth0',
          },
        } as any,
      })
    }

    // 4) Return the Payload user; frontend keeps using Auth0 token for auth
    return NextResponse.json({
      success: true,
      user,
    })
  } catch (err) {
    console.error('Auth0 login error:', err)
    return NextResponse.json({ error: 'Invalid Auth0 token' }, { status: 401 })
  }
}
