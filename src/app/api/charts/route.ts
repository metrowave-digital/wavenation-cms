import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://wavenation.media/api/charts?limit=10&depth=0', {
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch charts' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
