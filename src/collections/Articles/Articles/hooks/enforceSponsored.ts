export const enforceSponsored = async ({
  data,
  operation,
}: {
  data: any
  operation: 'create' | 'update'
}) => {
  if (!data) return data

  const isSponsored =
    data.type === 'sponsored' || (Array.isArray(data.badges) && data.badges.includes('sponsored'))

  if (!isSponsored) return data

  /* ----------------------------------------
     Enforce Sponsored Badge
  ----------------------------------------- */
  data.badges = Array.from(new Set([...(data.badges || []), 'sponsored']))

  /* ----------------------------------------
     Require Disclosure
  ----------------------------------------- */
  if (!data.sponsorDisclosure || data.sponsorDisclosure.trim() === '') {
    throw new Error('Sponsored articles must include a sponsor disclosure.')
  }

  return data
}
