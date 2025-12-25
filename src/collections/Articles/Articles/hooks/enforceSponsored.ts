import type { CollectionBeforeChangeHook } from 'payload'

export const enforceSponsored: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  /* -------------------------------------------------
     Resolve effective values (handle partial updates)
  -------------------------------------------------- */

  const type: unknown = data.type ?? originalDoc?.type

  const rawBadges: unknown[] = Array.isArray(data.badges)
    ? data.badges
    : Array.isArray(originalDoc?.badges)
      ? originalDoc.badges
      : []

  const badges: string[] = rawBadges.filter((b: unknown): b is string => typeof b === 'string')

  const isSponsored = type === 'sponsored' || badges.includes('sponsored')

  if (!isSponsored) return data

  /* -------------------------------------------------
     ENFORCE SPONSORED BADGE (NON-DESTRUCTIVE)
  -------------------------------------------------- */

  data.badges = Array.from(new Set<string>([...badges, 'sponsored']))

  /* -------------------------------------------------
     REQUIRE DISCLOSURE
  -------------------------------------------------- */

  const disclosure =
    typeof data.sponsorDisclosure === 'string'
      ? data.sponsorDisclosure.trim()
      : typeof originalDoc?.sponsorDisclosure === 'string'
        ? originalDoc.sponsorDisclosure.trim()
        : ''

  if (!disclosure) {
    throw new Error('Sponsored articles must include a sponsor disclosure.')
  }

  return data
}
