import type { Field } from 'payload'

export const creatorSpotlightFields: Field[] = [
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
  },

  {
    type: 'relationship',
    name: 'category',
    label: 'Category',
    relationTo: 'categories',
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
  },

  {
    type: 'textarea',
    name: 'intro',
    label: 'Intro',
  },

  // SECTION: ORIGIN
  {
    type: 'textarea',
    name: 'origin',
    label: 'Origin',
  },

  // SECTION: WORK
  {
    type: 'textarea',
    name: 'work',
    label: 'Work Highlights',
  },

  // SECTION: VISION
  {
    type: 'textarea',
    name: 'vision',
    label: 'Creator Vision',
  },

  // MEDIA ASSETS — THE PART CAUSING THE ERROR
  {
    type: 'array',
    name: 'mediaAssets',
    dbName: 'cs_media', // << FIX: shorten table name
    label: 'Videos & Photos',
    fields: [
      {
        type: 'select',
        name: 'type',
        label: 'Media Type',
        // ❌ dbName NOT allowed on select fields — Payload will error
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
        ],
        required: true,
      },
      {
        type: 'upload',
        name: 'file',
        label: 'Upload File',
        relationTo: 'media',
      },
      {
        type: 'text',
        name: 'caption',
        label: 'Caption',
      },
      {
        type: 'text',
        name: 'credit',
        label: 'Credit',
      },
    ],
  },
]
