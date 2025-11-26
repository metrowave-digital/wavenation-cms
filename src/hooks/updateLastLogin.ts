import type { PayloadRequest } from 'payload'
import { lookupGeo } from '@/utils/geo'

// -------------------------
// TYPES
// -------------------------

export type LoginStatus =
  | 'success'
  | 'failed'
  | 'failed_locked'
  | 'blocked_lockout'
  | 'blocked_suspended'

export type LoginHistoryEntry = {
  timestamp: string
  ip?: string
  userAgent?: string
  status: LoginStatus
  city?: string
  region?: string
  country?: string
  device?: string
}

export type LoginAnalyticsArgs = {
  user?: any // we keep this loose to avoid fighting Payload's generated User type
  req: PayloadRequest
  success?: false // Payload sets `false` on failure, `undefined` on success
}

// -------------------------
// CONSTANTS
// -------------------------

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15
const SUSPEND_AFTER_LOCKOUTS = 3
const SUSPEND_DURATION_HOURS = 24

// -------------------------
// HELPERS
// -------------------------

const getClientIp = (req: PayloadRequest): string => {
  const r: any = req
  const raw = r.ip ?? r.headers?.['x-forwarded-for']
  if (Array.isArray(raw)) return raw[0] ?? 'unknown'
  if (typeof raw === 'string') return raw.split(',')[0].trim()
  return 'unknown'
}

const getUserAgent = (req: PayloadRequest): string => {
  const h: any = req.headers
  const val = h?.['user-agent']
  if (Array.isArray(val)) return val[0] ?? 'unknown'
  return (val as string) ?? 'unknown'
}

const basicDeviceFingerprint = (ua: string): string => {
  if (ua === 'unknown') return 'unknown'
  const lower = ua.toLowerCase()

  const isMobile = lower.includes('iphone') || lower.includes('android') || lower.includes('mobile')

  const os = lower.includes('mac')
    ? 'macOS'
    : lower.includes('windows')
      ? 'Windows'
      : lower.includes('linux')
        ? 'Linux'
        : lower.includes('ios')
          ? 'iOS'
          : lower.includes('android')
            ? 'Android'
            : 'Unknown OS'

  const browser = lower.includes('chrome')
    ? 'Chrome'
    : lower.includes('safari')
      ? 'Safari'
      : lower.includes('firefox')
        ? 'Firefox'
        : lower.includes('edge')
          ? 'Edge'
          : lower.includes('opera')
            ? 'Opera'
            : 'Unknown Browser'

  return `${isMobile ? 'Mobile' : 'Desktop'} · ${os} · ${browser}`
}

const pushHistory = (user: any, entry: Omit<LoginHistoryEntry, 'timestamp'>) => {
  const history: LoginHistoryEntry[] = user.loginHistory || []
  history.push({
    timestamp: new Date().toISOString(),
    ...entry,
  })
  user.loginHistory = history
}

const sendLockoutEmail = async (
  user: any,
  req: PayloadRequest,
  reason: 'lockout' | 'suspension',
) => {
  const payloadAny = (req as any).payload as any
  if (!user.email || !payloadAny?.sendEmail) return

  const subject =
    reason === 'lockout'
      ? 'Your WaveNation account has been locked'
      : 'Your WaveNation account has been suspended'

  const message =
    reason === 'lockout'
      ? 'Your account was locked due to multiple failed login attempts.'
      : 'Your account has been suspended due to repeated lockouts.'

  await payloadAny.sendEmail({
    to: user.email,
    subject,
    html: `<p>${message}</p>`,
    text: message,
  })
}

// -------------------------
// MAIN HOOK
// -------------------------

export const updateLastLogin = async ({
  user,
  req,
  success,
}: LoginAnalyticsArgs): Promise<void> => {
  if (!user) return

  const now = new Date()
  const ip = getClientIp(req)
  const userAgent = getUserAgent(req)
  const device = basicDeviceFingerprint(userAgent)
  const geo = await lookupGeo(ip)

  // Payload convention:
  //   success === undefined → login success
  //   success === false      → login failure
  const didSucceed = success === undefined

  const prevLockouts: number = user.lockoutCount ?? 0
  const wasLocked: boolean = !!user.isLocked
  const wasSuspended: boolean = !!user.isSuspended

  const payloadAny = (req as any).payload as any

  // -------------------------
  // ACTIVE SUSPENSION
  // -------------------------
  if (user.isSuspended) {
    const until = user.suspendedUntil ? new Date(user.suspendedUntil) : null

    if (until && now < until) {
      pushHistory(user, {
        status: 'blocked_suspended',
        ip,
        userAgent,
        city: geo?.city,
        region: geo?.region,
        country: geo?.country,
        device,
      })

      await payloadAny.update({
        collection: 'users',
        id: user.id,
        data: {
          loginHistory: user.loginHistory,
        },
      })

      return
    }

    // suspension expired
    user.isSuspended = false
    user.suspendedUntil = undefined
    user.lockoutCount = 0
  }

  // -------------------------
  // ACTIVE LOCKOUT
  // -------------------------
  if (user.isLocked && user.lastFailedLogin) {
    const lastFail = new Date(user.lastFailedLogin)
    const diffMinutes = (now.getTime() - lastFail.getTime()) / (1000 * 60)

    if (diffMinutes < LOCK_DURATION_MINUTES) {
      pushHistory(user, {
        status: 'blocked_lockout',
        ip,
        userAgent,
        city: geo?.city,
        region: geo?.region,
        country: geo?.country,
        device,
      })

      await payloadAny.update({
        collection: 'users',
        id: user.id,
        data: {
          loginHistory: user.loginHistory,
        },
      })

      return
    }

    // lockout expired
    user.isLocked = false
    user.failedLoginAttempts = 0
  }

  // -------------------------
  // SUCCESSFUL LOGIN
  // -------------------------
  if (didSucceed) {
    pushHistory(user, {
      status: 'success',
      ip,
      userAgent,
      city: geo?.city,
      region: geo?.region,
      country: geo?.country,
      device,
    })

    await payloadAny.update({
      collection: 'users',
      id: user.id,
      data: {
        lastLogin: now.toISOString(),
        failedLoginAttempts: 0,
        isLocked: false,
        loginCount: (user.loginCount ?? 0) + 1,
        loginHistory: user.loginHistory,
      },
    })

    return
  }

  // -------------------------
  // FAILED LOGIN
  // -------------------------
  const fails: number = (user.failedLoginAttempts ?? 0) + 1
  let isLocked = false
  let lockouts = prevLockouts
  let isSuspended = !!user.isSuspended
  let suspendedUntil: string | undefined

  if (fails >= MAX_FAILED_ATTEMPTS) {
    isLocked = true
    lockouts += 1
  }

  if (isLocked && lockouts >= SUSPEND_AFTER_LOCKOUTS) {
    isSuspended = true
    suspendedUntil = new Date(now.getTime() + SUSPEND_DURATION_HOURS * 3600000).toISOString()
  }

  pushHistory(user, {
    status: isLocked ? 'failed_locked' : 'failed',
    ip,
    userAgent,
    city: geo?.city,
    region: geo?.region,
    country: geo?.country,
    device,
  })

  await payloadAny.update({
    collection: 'users',
    id: user.id,
    data: {
      failedLoginAttempts: fails,
      isLocked,
      lastFailedLogin: now.toISOString(),
      lockoutCount: lockouts,
      isSuspended,
      suspendedUntil,
      loginHistory: user.loginHistory,
    },
  })

  if (!wasLocked && isLocked && !isSuspended) {
    await sendLockoutEmail(user, req, 'lockout')
  }

  if (!wasSuspended && isSuspended) {
    await sendLockoutEmail(user, req, 'suspension')
  }
}
