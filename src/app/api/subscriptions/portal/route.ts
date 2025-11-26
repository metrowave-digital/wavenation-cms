import { NextResponse } from 'next/server'
import payload from 'payload'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// No apiVersion = avoids TS mismatches with Stripe types
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * Get or create Stripe Customer for Billing Portal
 */
async function getOrCreateStripeCustomer(user: any) {
  // If user already has a customer ID → return
  if (user.subscription?.providerCustomerId) {
    return user.subscription.providerCustomerId as string
  }

  // Create new Stripe Customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    metadata: { userId: user.id },
  })

  // Update user record with providerCustomerId
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      subscription: {
        ...(user.subscription || {}),
        provider: 'stripe',
        providerCustomerId: customer.id,
      },
    },
  })

  return customer.id
}

/**
 * Stripe Customer Billing Portal Entry
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Fetch user
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure a Stripe Customer exists
    const customerId = await getOrCreateStripeCustomer(user)

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Billing Portal Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
