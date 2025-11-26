import { NextResponse } from 'next/server'
import crypto from 'crypto'
import payload from 'payload'

export async function POST(req: Request) {
  const body = await req.formData()
  const dataObj: any = {}
  body.forEach((value, key) => (dataObj[key] = value))

  // Verify Paddle signature
  const signature = dataObj.p_signature
  delete dataObj.p_signature

  const sorted = Object.keys(dataObj)
    .sort()
    .reduce((o, k) => ({ ...o, [k]: dataObj[k] }), {})

  const verifier = crypto.createVerify('sha1')
  verifier.update(JSON.stringify(sorted))
  const valid = verifier.verify(process.env.PADDLE_PUBLIC_KEY!, signature, 'base64')

  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const eventId = dataObj.alert_id

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
      provider: 'paddle',
      eventType: dataObj.alert_name,
      payload: dataObj,
    },
  })

  //-----------------------------------------------------
  // NORMALIZE SUBSCRIPTION DATA
  //-----------------------------------------------------
  if (dataObj.alert_name?.includes('subscription')) {
    const subscriptionData = {
      provider: 'paddle',
      providerSubscriptionId: dataObj.subscription_id,
      providerCustomerId: dataObj.user_id,

      status: dataObj.status?.toLowerCase(),
      currentPeriodStart: dataObj.event_time,
      currentPeriodEnd: dataObj.next_bill_date,

      cancelAtPeriodEnd: dataObj.cancellation_effective_date ? true : false,
      canceledAt: dataObj.cancellation_effective_date ?? null,

      // Normalization: paddle uses next_bill_date
      renewalDate: dataObj.next_bill_date ?? null,
    }

    // Find user
    const user = await payload.find({
      collection: 'users',
      where: { 'subscription.providerCustomerId': { equals: dataObj.user_id } },
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
