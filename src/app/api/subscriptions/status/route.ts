import { NextResponse } from 'next/server'
import payload from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET current subscription status for a user.
 *
 * Expects:
 *   - POST { userId: string }
 * Returns:
 *   {
 *     subscription: { ... },
 *     plan: { ... },
 *     entitlements: [ ... ]
 *   }
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // --------------------------------------------------------
    // 1. Fetch User
    // --------------------------------------------------------
    const user: any = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const subscription = user.subscription

    // If no subscription object at all → return basic structure
    if (!subscription || !subscription.status) {
      return NextResponse.json({
        subscription: null,
        plan: null,
        entitlements: [],
        active: false,
      })
    }

    // --------------------------------------------------------
    // 2. Resolve Plan (SubscriptionPlans)
    // --------------------------------------------------------
    let plan: any = null
    let entitlements: any[] = []

    if (subscription.plan) {
      plan = await payload.findByID({
        collection: 'subscription-plans',
        id: subscription.plan,
      })

      // Get entitlements (array of relationship IDs)
      if (plan?.entitlements?.length > 0) {
        const entitlementsQuery = await payload.find({
          collection: 'entitlements',
          where: {
            id: { in: plan.entitlements },
          },
          limit: 500,
        })

        entitlements = entitlementsQuery.docs
      }
    }

    // --------------------------------------------------------
    // 3. Return combined subscription + plan info
    // --------------------------------------------------------
    return NextResponse.json({
      active: subscription.status === 'active',
      subscription: {
        provider: subscription.provider,
        providerSubscriptionId: subscription.providerSubscriptionId,
        providerCustomerId: subscription.providerCustomerId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        canceledAt: subscription.canceledAt,
        nextBillingAttempt: subscription.nextBillingAttempt,
        renewalDate: subscription.renewalDate,
      },
      plan: plan
        ? {
            id: plan.id,
            name: plan.name,
            slug: plan.slug,
            price: plan.price,
            billingInterval: plan.billingInterval,
            features: plan.features,
            isActive: plan.isActive,
          }
        : null,
      entitlements,
    })
  } catch (error: any) {
    console.error('Subscription Status Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
