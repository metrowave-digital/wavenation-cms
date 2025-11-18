// src/hooks/normalizeTagNames.ts

interface BeforeChangeArgs {
  data?: Record<string, any>
  req: any
}

/**
 * Normalize `name` and `slug` to lowercase, URL-safe.
 */
export const normalizeTagNames = ({ data }: BeforeChangeArgs) => {
  if (!data || !data.name) return data

  const raw = String(data.name).trim().toLowerCase()

  data.name = raw
  data.slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  return data
}
