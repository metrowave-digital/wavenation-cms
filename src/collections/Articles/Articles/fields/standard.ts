import { Field } from 'payload'

export const standardArticleFields: Field[] = [
  // --------------------
  // BASIC METADATA
  // --------------------
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
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
  },

  {
    type: 'text',
    name: 'tags',
    label: 'Tags',
    hasMany: true,
  },

  {
    type: 'date',
    name: 'publishDate',
    label: 'Publish Date',
    admin: { position: 'sidebar' },
  },

  // --------------------
  // HERO IMAGE
  // --------------------
  {
    type: 'upload',
    name: 'heroImage',
    relationTo: 'media',
    label: 'Hero Image (16:9)',
    required: true,
  },

  {
    type: 'text',
    name: 'heroImageAlt',
    label: 'Image Alt Text',
    required: true,
  },

  // --------------------
  // ARTICLE BODY
  // --------------------
  {
    type: 'textarea',
    name: 'introParagraph',
    label: 'Intro Paragraph',
    maxLength: 300,
    required: true,
  },

  {
    type: 'textarea',
    name: 'section1Context',
    label: 'Section 1 — Context / Background',
    required: true,
  },

  {
    type: 'textarea',
    name: 'section2MainStory',
    label: 'Section 2 — Main Story / Details',
    required: true,
  },

  {
    type: 'textarea',
    name: 'section3CulturalAnalysis',
    label: 'Section 3 — Cultural Analysis (optional)',
  },

  {
    type: 'textarea',
    name: 'section4WhatsNext',
    label: 'Section 4 — What’s Next',
  },

  // --------------------
  // CREDITS / SOURCES
  // --------------------
  {
    type: 'textarea',
    name: 'creditsSources',
    label: 'Credits & Sources',
  },

  // --------------------
  // SOCIAL COPY
  // --------------------
  {
    type: 'text',
    name: 'socialCopyShort',
    label: 'Social Copy (Short Caption)',
  },
  {
    type: 'textarea',
    name: 'socialCopyLong',
    label: 'Social Copy (Long Caption)',
  },

  // --------------------
  // ALT TEXT FOR INLINE IMAGES
  // --------------------
  {
    type: 'textarea',
    name: 'altTextForImages',
    label: 'Alt Text for Images',
  },

  // --------------------
  // ENGAGEMENT METRICS
  // --------------------
  {
    type: 'group',
    name: 'engagement',
    label: 'Engagement Metrics',
    admin: {
      position: 'sidebar',
      description: 'Auto-updated metrics for analytics + social proof',
    },
    fields: [
      {
        name: 'views',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
      },
      {
        name: 'likes',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
      },
      {
        name: 'shares',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
      },
      {
        name: 'comments',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
      },
      {
        name: 'reactions',
        type: 'array',
        labels: {
          singular: 'Reaction',
          plural: 'Reactions',
        },
        admin: { readOnly: true },
        fields: [
          {
            name: 'type',
            label: 'Reaction Type',
            type: 'text',
          },
          {
            name: 'count',
            type: 'number',
            defaultValue: 0,
          },
        ],
      },
    ],
  },
]
