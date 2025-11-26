import { NextResponse } from 'next/server'
import payload from 'payload'
import type { Event } from '@/payload-types'
import { requireAdmin } from '@/app/api/utils/auth/requireAdmin'

/**
 * GET /api/events/admin/[id]
 * Admin-only event fetch by ID (PK)
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await payload.findByID({
      collection: 'events',
      id: params.id,
    })

    return NextResponse.json({ event })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error fetching event' }, { status: 500 })
  }
}

/**
 * PATCH /api/events/admin/[id]
 * Update event (admin only)
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const event = await payload.update({
      collection: 'events',
      id: params.id,
      data: body,
    })

    return NextResponse.json({ event })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error updating event' }, { status: 500 })
  }
}

/**
 * DELETE /api/events/admin/[id]
 * Delete event (admin only)
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await payload.delete({
      collection: 'events',
      id: params.id,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error deleting event' }, { status: 500 })
  }
}
