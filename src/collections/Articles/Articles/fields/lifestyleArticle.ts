import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const lifestyleArticleFields: Field[] = [
  /* ============================================================
     METADATA
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
      description: 'Primary lifestyle category.',
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

  /* ============================================================
     MAIN BODY — BLOCK EDITOR
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Lifestyle Article Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, insights, examples, tips, cultural context, and lifestyle imagery.',
    },
  },

  /* ============================================================
     STRUCTURED LIFESTYLE SECTIONS (OPTIONAL)
     Complements block content for feeds & search
  ============================================================ */

  {
    type: 'group',
    name: 'lifestyleFramework',
    label: 'Lifestyle Framework',
    admin: {
      description: 'Optional structured sections used for summaries, highlights, and previews.',
    },
    fields: [
      {
        type: 'textarea',
        name: 'insight',
        label: 'Core Insight',
      },
      {
        type: 'textarea',
        name: 'examples',
        label: 'Examples / Scenarios',
      },
      {
        type: 'textarea',
        name: 'practicalTips',
        label: 'Practical Tips',
      },
      {
        type: 'textarea',
        name: 'culturalRelevance',
        label: 'Cultural Relevance',
      },
    ],
  },

  /* ============================================================
     IMAGERY
     (Retains array — Postgres safe)
  ============================================================ */

  {
    type: 'array',
    name: 'imagery',
    label: 'Imagery',
    labels: {
      singular: 'Image',
      plural: 'Images',
    },
    admin: {
      description: 'Lifestyle imagery with accessibility text.',
    },
    fields: [
      {
        type: 'upload',
        name: 'image',
        relationTo: 'media',
        required: true,
      },
      {
        type: 'text',
        name: 'alt',
        required: true,
        admin: {
          description: 'Accessibility description for the image.',
        },
      },
      {
        type: 'text',
        name: 'credit',
        admin: {
          description: 'Optional image credit.',
        },
      },
    ],
  },

  /* ============================================================
     SEARCH / FEED SUPPORT
     Safe additions — no migrations
  ============================================================ */

  {
    type: 'textarea',
    name: 'excerpt',
    label: 'Excerpt',
    admin: {
      description: 'Optional excerpt used in feeds and search results.',
    },
  },

  {
    type: 'checkbox',
    name: 'excludeFromSearch',
    label: 'Exclude from Search',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Prevent this article from appearing in search.',
    },
  },
]
