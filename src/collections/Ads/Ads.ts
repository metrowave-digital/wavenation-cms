import type { CollectionConfig } from 'payload'

export const Ads: CollectionConfig = {
  slug: 'ads',

  admin: {
    group: 'Ads',
    useAsTitle: 'name',
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'advertiser',
      type: 'relationship',
      relationTo: 'advertisers',
      required: true,
    },
    {
      name: 'placement',
      type: 'relationship',
      relationTo: 'ad-placements',
      required: true,
    },
    {
      name: 'mediaType',
      type: 'select',
      options: ['image', 'video', 'audio', 'html'].map((v) => ({ label: v, value: v })),
    },
    { name: 'creative', type: 'upload', relationTo: 'media' },
    { name: 'ctaUrl', type: 'text' },
    { name: 'metadata', type: 'json' },
  ],
}
