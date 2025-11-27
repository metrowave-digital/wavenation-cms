import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import payloadConfig from '@/payload.config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    // Lazy-load Stripe (NEVER at top-level)
    const Stripe = (await import('stripe')).default

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }

    // Stripe must be created inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const { userId, priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    const payload = await getPayloadHMR({ config: payloadConfig })

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user?.email) {
      return NextResponse.json({ error: 'User does not have an email' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('❌ Stripe Subscription Create Error:', error)
    return NextResponse.json(
      { error: 'Something went wrong creating checkout session' },
      { status: 500 },
    )
  }
}
