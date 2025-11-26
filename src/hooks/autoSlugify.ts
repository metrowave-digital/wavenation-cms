type AutoSlugifyArgs = {
  data: {
    title?: string
    slug?: string
    [key: string]: any
  }
}

export const autoSlugify = ({ data }: AutoSlugifyArgs) => {
  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  return data
}
