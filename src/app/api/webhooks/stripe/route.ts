import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import payload from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

/**
 * Stripe Webhook Handler
 */
export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    )
  } catch (err: any) {
    console.error('⚠️ Stripe Signature Verification Failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const eventId = event.id

  // ---------------------------------------------------------------
  // Prevent Replay
  // ---------------------------------------------------------------
  const existing = await payload.find({
    collection: 'webhook-events',
    where: { eventId: { equals: eventId } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return NextResponse.json({ message: 'Already processed' }, { status: 200 })
  }

  // ---------------------------------------------------------------
  // Log Webhook Event
  // ---------------------------------------------------------------
  const webhookLog = await payload.create({
    collection: 'webhook-events',
    data: {
      eventId,
      provider: 'stripe',
      eventType: event.type,
      payload: JSON.parse(JSON.stringify(event.data.object)),
      processed: false,
      createdAt: new Date().toISOString(),
    },
  })

  const webhookEventId = webhookLog.id
  const obj = event.data.object as any
  let subscriptionUpdate: any = null

  // ---------------------------------------------------------------
  // 1. CUSTOMER.SUBSCRIPTION.* EVENTS
  // ---------------------------------------------------------------
  if (event.type.startsWith('customer.subscription')) {
    const item = obj.items?.data?.[0]
    const priceId = item?.price?.id

    subscriptionUpdate = {
      provider: 'stripe',
      providerSubscriptionId: obj.id,
      providerCustomerId: obj.customer,
      status: obj.status.replace('_', '-'),
      currentPeriodStart: new Date(obj.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(obj.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: obj.cancel_at_period_end,
      canceledAt: obj.canceled_at ? new Date(obj.canceled_at * 1000).toISOString() : undefined,
      nextBillingAttempt: obj.next_pending_invoice_item_invoice
        ? new Date(obj.next_pending_invoice_item_invoice * 1000).toISOString()
        : undefined,
      renewalDate: obj.cancel_at ? new Date(obj.cancel_at * 1000).toISOString() : undefined,
      plan: priceId ? await findPlanByStripe(priceId) : undefined,
    }
  }

  // ---------------------------------------------------------------
  // 2. CHECKOUT SESSION COMPLETED (initial subscription creation)
  // ---------------------------------------------------------------
  if (event.type === 'checkout.session.completed') {
    const session = obj as Stripe.Checkout.Session

    if (session.mode === 'subscription' && session.subscription) {
      // Fetch subscription from Stripe
      const subscriptionResponse = await stripe.subscriptions.retrieve(
        session.subscription as string,
      )

      // ⭐ UNIVERSAL FIX: works with all Stripe SDK variations
      const subscription = (subscriptionResponse as any).data ?? subscriptionResponse

      const item = subscription.items.data?.[0]
      const priceId = item?.price?.id

      subscriptionUpdate = {
        provider: 'stripe',
        providerSubscriptionId: subscription.id,
        providerCustomerId: subscription.customer,
        status: subscription.status,

        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),

        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),

        cancelAtPeriodEnd: subscription.cancel_at_period_end,

        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : undefined,

        nextBillingAttempt: subscription.next_pending_invoice_item_invoice
          ? new Date(subscription.next_pending_invoice_item_invoice * 1000).toISOString()
          : undefined,

        renewalDate: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : undefined,

        plan: priceId ? await findPlanByStripe(priceId) : undefined,
      }
    }
  }

  // ---------------------------------------------------------------
  // Apply subscription update to USER
  // ---------------------------------------------------------------
  if (subscriptionUpdate) {
    const userLookup = await payload.find({
      collection: 'users',
      where: {
        'subscription.providerCustomerId': {
          equals: subscriptionUpdate.providerCustomerId,
        },
      },
      limit: 1,
    })

    const user = userLookup.docs[0]

    if (user) {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          subscription: subscriptionUpdate,
        },
      })
    }
  }

  // ---------------------------------------------------------------
  // Mark webhook as processed
  // ---------------------------------------------------------------
  await payload.update({
    collection: 'webhook-events',
    id: webhookEventId,
    data: { processed: true },
  })

  return NextResponse.json({ success: true })
}

/**
 * Helper: Find Paid Plan by Stripe Price ID
 */
async function findPlanByStripe(priceId: string) {
  const result = await payload.find({
    collection: 'paid-subscriptions',
    where: { stripePriceId: { equals: priceId } },
    limit: 1,
  })

  return result.docs[0]?.id
}
