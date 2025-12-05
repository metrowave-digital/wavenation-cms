import type { CollectionBeforeValidateHook } from 'payload'

export const generateSlug: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) {
    return data
  }

  // If user manually entered a slug, clean it but don't overwrite it
  if (typeof data.slug === 'string' && data.slug.trim().length > 0) {
    data.slug = data.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    return data
  }

  const source =
    (typeof data.title === 'string' && data.title.trim().length > 0 ? data.title : null) ||
    (typeof originalDoc?.title === 'string' ? originalDoc.title : null)

  if (!source) {
    return data
  }

  const slug = source
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  data.slug = slug

  return data
}
