import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    // 🔥 Lazy import Stripe so it NEVER loads during build
    const Stripe = (await import('stripe')).default

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }

    // 🔥 DO NOT SET apiVersion — Stripe 2025+ chooses automatically
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const { customerId } = await req.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('❌ Portal Route Error:', error)
    return NextResponse.json({ error: 'Billing portal failed.' }, { status: 500 })
  }
}
