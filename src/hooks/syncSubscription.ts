// ===============================
// SUBSCRIPTION TYPE
// ===============================
type Subscription = {
  status?: string
  currentPeriodStart?: string | Date | null
  currentPeriodEnd?: string | Date | null
  cancelAtPeriodEnd?: boolean
  canceledAt?: string | Date | null
  trialStart?: string | Date | null
  trialEnd?: string | Date | null
  nextBillingAttempt?: string | Date | null // FIXED
  renewalDate?: string | Date | null // FIXED
  provider?: string
  metadata?: Record<string, any>
  history?: Array<{
    date: string
    message: string
  }>
  [key: string]: any
}

// ===============================
// HOOK ARG TYPE
// ===============================
type SyncSubscriptionArgs = {
  data: {
    subscription?: Subscription
    [key: string]: any
  }
  req?: any
}

// ===============================
// MAIN HOOK
// ===============================
export const syncSubscription = async ({ data }: SyncSubscriptionArgs) => {
  const sub = data.subscription
  if (!sub) return data

  const now = new Date()
  const toDate = (v?: string | Date | null) => (v ? new Date(v) : undefined)

  // Safe conversions
  const start = toDate(sub.currentPeriodStart)
  const end = toDate(sub.currentPeriodEnd)
  const trialStart = toDate(sub.trialStart)
  const trialEnd = toDate(sub.trialEnd)
  const canceledAt = toDate(sub.canceledAt)
  const nextAttempt = toDate(sub.nextBillingAttempt)
  const renewal = toDate(sub.renewalDate) ?? end

  // -------------------------------------------
  // 1️⃣ TRIAL LOGIC
  // -------------------------------------------
  let isTrialing = false
  if (trialStart && trialEnd) {
    isTrialing = now >= trialStart && now <= trialEnd
  }

  // -------------------------------------------
  // 2️⃣ ACTIVE LOGIC
  // -------------------------------------------
  let isActive = false
  if (end && now <= end && sub.status === 'active') {
    isActive = true
  }

  // -------------------------------------------
  // 3️⃣ EXPIRED LOGIC
  // -------------------------------------------
  let isExpired = false
  if (end && now > end && !sub.cancelAtPeriodEnd) {
    isExpired = true
  }

  // -------------------------------------------
  // 4️⃣ CANCELED LOGIC
  // -------------------------------------------
  let isCanceled = false
  if (sub.cancelAtPeriodEnd || canceledAt) {
    isCanceled = true
  }

  // -------------------------------------------
  // 5️⃣ DAYS REMAINING
  // -------------------------------------------
  let daysRemaining: number | null = null
  if (end && now <= end) {
    const diff = end.getTime() - now.getTime()
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  // -------------------------------------------
  // 6️⃣ FINAL STATUS DETERMINATION
  // -------------------------------------------
  let finalStatus = sub.status || 'unknown'

  if (isTrialing) finalStatus = 'trialing'
  else if (isCanceled && end && now <= end) finalStatus = 'canceled_pending'
  else if (isCanceled && (!end || now > end)) finalStatus = 'canceled'
  else if (isExpired) finalStatus = 'expired'
  else if (isActive) finalStatus = 'active'
  else finalStatus = 'inactive'

  // -------------------------------------------
  // 7️⃣ SUBSCRIPTION HISTORY LOGGING
  // -------------------------------------------
  const logHistory = (msg: string) => {
    if (!sub.history) sub.history = []
    sub.history.push({
      date: new Date().toISOString(),
      message: msg,
    })
  }

  if (finalStatus !== sub.status) {
    logHistory(`Status changed: ${sub.status} → ${finalStatus}`)
  }

  // -------------------------------------------
  // 8️⃣ WRITE BACK CALCULATED FIELDS
  // -------------------------------------------
  data.subscription = {
    ...sub,

    // Boolean flags
    isActive,
    isTrialing,
    isCanceled,
    isExpired,

    // Time-based fields
    daysRemaining,
    renewalDate: renewal ? renewal.toISOString() : null,
    nextBillingAttempt: nextAttempt ? nextAttempt.toISOString() : null,

    // Final status
    status: finalStatus,
  }

  return data
}
