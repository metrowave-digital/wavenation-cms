import type { CollectionConfig } from 'payload'

export const Advertisers: CollectionConfig = {
  slug: 'advertisers',

  admin: {
    useAsTitle: 'name',
    group: 'Ads',
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'contactEmail', type: 'text' },
    { name: 'contactPhone', type: 'text' },
    { name: 'website', type: 'text' },

    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'notes', type: 'textarea' },
  ],
}
