import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const standardArticleFields: Field[] = [
  /* ============================================================
     BASIC METADATA
  ============================================================ */

  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    admin: {
      description: 'Optional secondary headline.',
    },
  },

  {
    type: 'relationship',
    name: 'category',
    relationTo: 'categories',
    required: true,
    admin: {
      description: 'Primary category for this article.',
    },
  },

  {
    type: 'relationship',
    name: 'subCategory',
    relationTo: 'categories',
    admin: {
      description: 'Optional sub-category.',
    },
  },

  {
    type: 'relationship',
    name: 'tags',
    relationTo: 'tags',
    hasMany: true,
    admin: {
      description: 'Tags used for discovery and search.',
    },
  },

  /* ============================================================
     HERO IMAGE (STANDARD TEMPLATE)
  ============================================================ */

  {
    type: 'upload',
    name: 'standardHeroImage',
    label: 'Hero Image (Standard)',
    relationTo: 'media',
    required: true,
    admin: {
      description: 'Primary hero image for standard articles.',
    },
  },

  {
    type: 'text',
    name: 'standardHeroImageAlt',
    label: 'Hero Image Alt Text',
    required: true,
    admin: {
      description: 'Accessibility description for the hero image.',
    },
  },

  /* ============================================================
     ARTICLE BODY
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Article Body',
    required: true,
    blocks: articleBlocks,
    admin: {
      description: 'Main article content.',
    },
  },

  /* ============================================================
     CONTEXT MODULE (OPTIONAL)
     Editorial framing / explainer box
  ============================================================ */

  {
    type: 'group',
    name: 'contextModule',
    label: 'Context Module',
    admin: {
      description: 'Optional contextual framing (explainer, cultural context, review breakdown).',
    },
    fields: [
      {
        type: 'select',
        name: 'type',
        label: 'Context Type',
        options: [
          { label: 'What You Need to Know (News)', value: 'news' },
          { label: 'Why This Matters (Culture)', value: 'culture' },
          { label: 'Review Breakdown', value: 'review' },
        ],
        admin: {
          description: 'Controls the presentation style.',
        },
      },
      {
        type: 'array',
        name: 'items',
        label: 'Context Items',
        admin: {
          description: 'Short bullet-style context points.',
        },
        fields: [
          {
            type: 'text',
            name: 'text',
            label: 'Item',
            required: true,
          },
        ],
      },
    ],
  },

  /* ============================================================
     CREDITS & SOURCES
  ============================================================ */

  {
    type: 'textarea',
    name: 'creditsSources',
    label: 'Credits & Sources',
    admin: {
      description: 'Sources, references, credits, or acknowledgements.',
    },
  },

  /* ============================================================
     INTERNAL / SEARCH SUPPORT (NON-EDITORIAL)
     ⚠ Safe additions – no migrations
  ============================================================ */

  {
    type: 'textarea',
    name: 'searchSummary',
    label: 'Search Summary',
    admin: {
      description: 'Optional summary used for search indexing and previews.',
    },
  },

  {
    type: 'checkbox',
    name: 'excludeFromSearch',
    label: 'Exclude from Search',
    defaultValue: false,
    admin: {
      description: 'Prevent this article from appearing in search results.',
      position: 'sidebar',
    },
  },
]
