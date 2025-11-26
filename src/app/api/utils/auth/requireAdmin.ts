import payload from 'payload'
import { NextResponse } from 'next/server'

export async function requireAdmin(req: Request) {
  // Payload adds authenticated user into req via local API
  const user = (req as any).user

  if (!user || !['admin'].includes(user.role)) {
    return null
  }

  return user
}
