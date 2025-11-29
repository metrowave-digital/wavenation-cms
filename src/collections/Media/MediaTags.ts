import type { CollectionConfig } from 'payload'

export const MediaTags: CollectionConfig = {
  slug: 'media-tags',

  admin: {
    group: 'Core',
    useAsTitle: 'label',
  },

  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
  },

  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'value',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.label) {
          data.value = data.label.toLowerCase().replace(/\s+/g, '-')
        }
        return data
      },
    ],
  },
}
