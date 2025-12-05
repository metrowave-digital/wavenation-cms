import type { CollectionConfig } from 'payload'

export const VideoGallery: CollectionConfig = {
  slug: 'video-galleries',
  labels: {
    singular: 'Video Gallery',
    plural: 'Video Galleries',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'videos'],
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
      name: 'videos',
      label: 'Videos',
      minRows: 1,
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: { description: 'Optional caption for this video.' },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: { description: 'Credit for this video.' },
        },
      ],
    },
  ],
}
