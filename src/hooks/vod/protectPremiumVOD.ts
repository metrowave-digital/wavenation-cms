// src/hooks/vod/protectPremiumVOD.ts
import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type VodDoc = {
  id: string | number
  isFree?: boolean
  // You can extend this with subscription tiers/rentals later
}

export const protectPremiumVOD: Access = async ({ req, id }: AccessArgs): Promise<boolean> => {
  const user = req.user as User | undefined

  if (!id) return false

  // Load VOD doc
  const vod = (await req.payload.findByID({
    collection: 'vod',
    id,
  })) as VodDoc

  // If free → always allow
  if (vod.isFree) return true

  // Must be logged in
  if (!user) return false

  // Simple subscription check – matches your current logic
  if (user.subscription?.status === 'active') return true

  // If you add entitlements later, check them here:
  // - user.subscription.level
  // - user.purchases
  // - rental windows, etc.

  return false
}
