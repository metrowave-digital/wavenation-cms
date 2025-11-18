export const generateSlug = ({ data }: { data: any }) => {
  if (!data || !data.title) return data

  const raw = String(data.title).trim().toLowerCase()

  data.slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  return data
}
