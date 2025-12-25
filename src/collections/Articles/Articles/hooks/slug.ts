import type { CollectionBeforeValidateHook } from 'payload'

export const generateSlug: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data

  /* ---------------------------------------------------------
     MANUAL SLUG (PRESERVE USER INTENT)
  --------------------------------------------------------- */
  if (typeof data.slug === 'string' && data.slug.trim().length > 0) {
    data.slug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-') // normalize
      .replace(/^-+|-+$/g, '') // trim dashes
    return data
  }

  /* ---------------------------------------------------------
     AUTO SLUG FROM TITLE
  --------------------------------------------------------- */
  const source =
    (typeof data.title === 'string' && data.title.trim().length > 0 ? data.title : null) ??
    (typeof originalDoc?.title === 'string' ? originalDoc.title : null)

  if (!source) return data

  data.slug = source
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return data
}
