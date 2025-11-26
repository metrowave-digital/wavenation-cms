import { NextResponse } from 'next/server'
import crypto from 'crypto'
import payload from 'payload'

export async function POST(req: Request) {
  const raw = await req.text()
  const sig = req.headers.get('x-signature')

  const computed = crypto
    .createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(raw)
    .digest('hex')

  if (computed !== sig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const body = JSON.parse(raw)
  const eventId = body.meta?.event_id

  // Replay protect
  const existing = await payload.find({
    collection: 'webhook-events',
    where: { eventId: { equals: eventId } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return NextResponse.json({ received: true, replay: true })
  }

  await payload.create({
    collection: 'webhook-events',
    data: {
      eventId,
      provider: 'lemonsqueezy',
      eventType: body.meta.event_name,
      payload: body,
    },
  })

  //----------------------------------------------
  // NORMALIZE LEMONSQUEEZY SUBSCRIPTIONS
  //----------------------------------------------

  if (body.meta.event_name.startsWith('subscription')) {
    const sub = body.data.attributes

    const subscriptionData = {
      provider: 'lemonsqueezy',
      providerSubscriptionId: body.data.id,
      providerCustomerId: sub.customer_id,

      status: sub.status,
      currentPeriodStart: sub.starts_at,
      currentPeriodEnd: sub.ends_at,

      cancelAtPeriodEnd: sub.cancelled === true,
      canceledAt: sub.cancelled_at,

      renewalDate: sub.renews_at,
      nextBillingAttempt: sub.renews_at,
    }

    const user = await payload.find({
      collection: 'users',
      where: { 'subscription.providerCustomerId': { equals: sub.customer_id } },
      limit: 1,
    })

    if (user.docs.length > 0) {
      await payload.update({
        collection: 'users',
        id: user.docs[0].id,
        data: { subscription: subscriptionData },
      })
    }
  }

  return NextResponse.json({ received: true })
}
