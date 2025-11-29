import type { CollectionConfig } from 'payload'

export const AdPlacements: CollectionConfig = {
  slug: 'ad-placements',

  admin: {
    group: 'Ads',
    useAsTitle: 'name',
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'placementType',
      type: 'select',
      required: true,
      options: ['radio', 'tv', 'web', 'mobile', 'podcast', 'app', 'live-event'].map((v) => ({
        label: v,
        value: v,
      })),
    },
    { name: 'description', type: 'textarea' },
    { name: 'dimensions', type: 'text' },
  ],
}
