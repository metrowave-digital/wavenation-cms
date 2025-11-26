// src/app/api/subscriptions/create/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const { userId, planId } = await req.json()

  const plan = await payload.findByID({
    collection: 'subscription-plans',
    id: planId,
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: userId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  })

  return NextResponse.json({ url: session.url })
}
