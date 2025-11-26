import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import payload from 'payload'

export const dynamic = 'force-dynamic'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  const { userId, priceId } = await req.json()

  if (!priceId) {
    return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
  }

  const user = await payload.findByID({
    collection: 'users',
    id: userId,
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    success_url: `${process.env.PUBLIC_SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PUBLIC_SITE_URL}/billing/cancelled`,
  })

  return NextResponse.json({ url: session.url })
}
