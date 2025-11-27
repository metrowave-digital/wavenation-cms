import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import payloadConfig from '@/payload.config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    // Lazy-load Stripe so it does NOT run during build
    const Stripe = (await import('stripe')).default

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }

    // Do NOT pass apiVersion — Stripe uses dashboard version automatically
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const { userId, planId } = await req.json()

    if (!userId || !planId) {
      return NextResponse.json({ error: 'Missing userId or planId' }, { status: 400 })
    }

    // Use HMR payload loader inside API routes
    const payload = await getPayloadHMR({ config: payloadConfig })

    // Fetch plan details
    const plan = await payload.findByID({
      collection: 'subscription-plans',
      id: planId,
    })

    if (!plan?.stripePriceId) {
      return NextResponse.json({ error: 'Plan missing stripePriceId' }, { status: 500 })
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: userId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Subscription Create Error:', err)
    return NextResponse.json({ error: 'Subscription creation failed' }, { status: 500 })
  }
}
