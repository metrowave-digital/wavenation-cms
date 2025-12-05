import type { CollectionConfig } from 'payload'

export const PhotoGallery: CollectionConfig = {
  slug: 'photo-galleries',
  labels: {
    singular: 'Photo Gallery',
    plural: 'Photo Galleries',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'photos'],
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
      name: 'photos',
      label: 'Photos',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: { description: 'Optional caption for this image.' },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: { description: 'Credit for this image.' },
        },
      ],
    },
  ],
}
