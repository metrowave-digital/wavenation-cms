import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const Stripe = (await import('stripe')).default

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }

    // ❗ IMPORTANT: Do NOT pass apiVersion for 2025+. It breaks TypeScript.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const { priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('❌ Subscription Checkout Error:', err)
    return NextResponse.json({ error: 'Subscription checkout failed' }, { status: 500 })
  }
}
