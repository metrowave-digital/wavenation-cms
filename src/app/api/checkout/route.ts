// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import payload from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// IMPORTANT: Do NOT pass apiVersion (your Stripe package enforces 2025-11-17 automatically)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type CheckoutRequestBody = {
  userId: string
  productId: string
  priceId?: string
  quantity?: number
}

// ------------------------------------------------------
// Helper: Get or create Stripe customer
// ------------------------------------------------------
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

// ------------------------------------------------------
// Main Checkout Route
// ------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody

    if (!body.userId || !body.productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 })
    }

    const quantity = body.quantity && body.quantity > 0 ? body.quantity : 1

    // Load Product
    const product: any = await payload.findByID({
      collection: 'products',
      id: body.productId,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Select Price
    let priceDocId: string | number =
      body.priceId && body.priceId !== '' ? body.priceId : product.prices?.[0]

    if (!priceDocId) {
      return NextResponse.json({ error: 'No price attached to product' }, { status: 400 })
    }

    const priceDoc: any = await payload.findByID({
      collection: 'prices',
      id: priceDocId,
    })

    if (!priceDoc?.stripePriceId) {
      return NextResponse.json({ error: 'Price missing stripePriceId' }, { status: 400 })
    }

    const { customerId } = await getOrCreateStripeCustomer(body.userId)

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price: priceDoc.stripePriceId,
          quantity,
        },
      ],
      metadata: {
        userId: body.userId,
        productId: body.productId,
        priceDocId: String(priceDocId),
        type: 'one-time',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
