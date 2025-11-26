// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    // Lazy-load everything that breaks build
    const Stripe = (await import('stripe')).default

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    const body = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: body.items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('❌ Checkout Route Error', err)
    return NextResponse.json({ error: 'Checkout failed.' }, { status: 500 })
  }
}
