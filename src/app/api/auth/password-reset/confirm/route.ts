// app/api/auth/password-reset/confirm/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    message: 'Password reset handled in Auth0. No local action needed.',
  })
}
