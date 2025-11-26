// src/app/api/users/me/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const auth0Domain = process.env.AUTH0_DOMAIN!
const auth0Audience = process.env.AUTH0_API_AUDIENCE!

const JWKS = createRemoteJWKSet(new URL(`https://${auth0Domain}/.well-known/jwks.json`))

export async function GET(req: Request) {
  try {
    // Expect Authorization: Bearer <auth0_access_token>
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const token = authHeader.slice('Bearer '.length).trim()

    // Verify Auth0 access token
    const { payload: jwtPayload } = await jwtVerify(token, JWKS, {
      issuer: `https://${auth0Domain}/`,
      audience: auth0Audience,
    })

    const auth0Sub = String(jwtPayload.sub ?? '')
    if (!auth0Sub) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Find corresponding Payload user by authProvider.auth0Id
    const result = await payload.find({
      collection: 'users',
      where: {
        'authProvider.auth0Id': { equals: auth0Sub },
      },
      limit: 1,
      overrideAccess: true,
    })

    const user = result.docs[0] || null

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('/api/users/me error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
