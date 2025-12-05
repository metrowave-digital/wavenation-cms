import type { CollectionConfig } from 'payload'

export const MediaAlbums: CollectionConfig = {
  slug: 'media-albums',
  labels: {
    singular: 'Media Album',
    plural: 'Media Albums',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'items'],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
      required: false,
    },

    {
      type: 'array',
      name: 'items',
      label: 'Album Items',
      minRows: 1,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: {
            description: 'Optional caption for this media item.',
          },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: {
            description: 'Credit for this media item.',
          },
        },
      ],
    },
  ],
}
