// src/hooks/publishDate.ts

interface BeforeChangeArgs {
  data?: Record<string, any>
  originalDoc?: Record<string, any>
  req: any
}

/**
 * When `isActive` is toggled on for the first time, set `publishedAt`.
 */
export const publishDate = ({ data, originalDoc }: BeforeChangeArgs) => {
  if (!data) return data

  const isNowActive = Boolean(data.isActive)
  const wasActiveBefore = Boolean(originalDoc?.isActive)

  if (isNowActive && !wasActiveBefore && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  return data
}
