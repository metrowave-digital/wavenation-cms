// src/app/api/entitlements/check/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const resourceId = searchParams.get('resourceId')

  const entitlements = await payload.find({
    collection: 'entitlements',
    where: {
      user: { equals: userId },
      resourceId: { equals: resourceId },
    },
  })

  return NextResponse.json({
    hasAccess: entitlements.totalDocs > 0,
  })
}
