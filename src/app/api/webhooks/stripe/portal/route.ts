import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import payload from 'payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  const { userId } = await req.json()

  const user = await payload.findByID({
    collection: 'users',
    id: userId,
  })

  const customerId = user.subscription?.providerCustomerId

  if (!customerId) {
    return NextResponse.json({ error: 'User has no Stripe customer ID' }, { status: 400 })
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.PUBLIC_SITE_URL}/account/billing`,
  })

  return NextResponse.json({ url: portal.url })
}
