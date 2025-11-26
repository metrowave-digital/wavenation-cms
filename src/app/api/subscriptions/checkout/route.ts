// src/app/api/subscriptions/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import payload from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
})

type SubscriptionCheckoutBody = {
  userId: string
  planId?: string
  planSlug?: string
}

// Helper: get or create Stripe customer for this user
async function getOrCreateStripeCustomer(userId: string) {
  const user: any = await payload.findByID({
    collection: 'users',
    id: userId,
  })

  if (!user) throw new Error('User not found')

  if (user.subscription?.providerCustomerId) {
    return { user, customerId: user.subscription.providerCustomerId as string }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    metadata: {
      userId: user.id,
    },
  })

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

  return { user, customerId: customer.id }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubscriptionCheckoutBody

    if (!body.userId || (!body.planId && !body.planSlug)) {
      return NextResponse.json({ error: 'Missing userId and planId/planSlug' }, { status: 400 })
    }

    // Resolve plan by ID or slug
    let plan: any | null = null

    if (body.planId) {
      plan = await payload.findByID({
        collection: 'subscription-plans',
        id: body.planId,
      })
    } else if (body.planSlug) {
      const result = await payload.find({
        collection: 'subscription-plans',
        where: {
          slug: { equals: body.planSlug },
        },
        limit: 1,
      })
      plan = result.docs[0]
    }

    if (!plan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 })
    }

    if (!plan.stripePriceId) {
      return NextResponse.json({ error: 'Plan missing stripePriceId' }, { status: 400 })
    }

    if (plan.isActive === false) {
      return NextResponse.json({ error: 'Plan is not active' }, { status: 400 })
    }

    const { customerId } = await getOrCreateStripeCustomer(body.userId)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: plan.trialPeriodDays || undefined,
        metadata: {
          userId: body.userId,
          planId: plan.id,
        },
      },
      metadata: {
        userId: body.userId,
        planId: plan.id,
        planSlug: plan.slug,
        type: 'subscription',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/subscriptions?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/subscriptions/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Subscription Checkout Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
