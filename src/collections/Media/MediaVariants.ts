import type { CollectionConfig } from 'payload'

export const MediaVariants: CollectionConfig = {
  slug: 'media-variants',

  admin: {
    useAsTitle: 'label',
    group: 'Core',
  },

  access: { read: () => true },

  fields: [
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'variant',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
