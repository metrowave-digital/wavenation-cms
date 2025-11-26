import type { Access } from 'payload'

export const apiKeyAccess: Access = ({ req }) => {
  // If a logged-in user hits this endpoint → always allowed
  if (req.user) return true

  // Check API key header
  const provided = req.headers.get('x-api-key')
  const expected = process.env.INTERNAL_API_KEY

  // Return strict boolean
  return provided === expected
}
