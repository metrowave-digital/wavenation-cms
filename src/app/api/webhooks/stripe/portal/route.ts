import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const Stripe = (await import('stripe')).default

    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      console.error('Missing STRIPE_SECRET_KEY')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(key)
    const { customerId } = await req.json()

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Stripe Portal Webhook Error:', err)
    return NextResponse.json({ error: 'Portal session failed' }, { status: 500 })
  }
}
