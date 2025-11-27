import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // Needed for raw body
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const Stripe = (await import('stripe')).default

    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const key = process.env.STRIPE_SECRET_KEY
    if (!secret || !key) {
      console.error('Missing Stripe webhook envs')
      return NextResponse.json({ received: true })
    }

    // Stripe requires RAW BODY, not parsed JSON
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    const stripe = new Stripe(key)

    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig!, secret)
    } catch (err) {
      console.error('❌ Stripe signature verification failed:', err)
      return new Response(`Webhook Error: ${(err as any).message}`, {
        status: 400,
      })
    }

    // ---- HANDLE EVENT TYPES ----
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted':
        console.log('Stripe Subscription Event:', event.type)
        break

      default:
        console.log('Unhandled event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('❌ Stripe Webhook Route Error:', err)
    return NextResponse.json({ received: true })
  }
}
