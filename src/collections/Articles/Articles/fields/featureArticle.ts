import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const featureArticleFields: Field[] = [
  /* ============================================================
     BASIC METADATA
  ============================================================ */

  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    admin: {
      description: 'Optional secondary headline or deck.',
    },
  },

  {
    type: 'relationship',
    name: 'category',
    relationTo: 'categories',
    required: true,
    admin: {
      description: 'Primary category for this feature story.',
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
    name: 'author',
    relationTo: 'profiles',
    required: true,
    admin: {
      description: 'Primary author or reporter.',
    },
  },

  /* ============================================================
     MAIN FEATURE BODY — BLOCK-DRIVEN
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Feature Article Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Build the narrative using blocks: lede, story arc, voices, analysis, impact, future outlook.',
    },
  },

  /* ============================================================
     FEATURE STRUCTURE (OPTIONAL)
     Longform framing without constraining creativity
  ============================================================ */

  {
    type: 'group',
    name: 'featureFramework',
    label: 'Feature Structure (Optional)',
    admin: {
      description:
        'Optional longform structure used for previews, summaries, and editorial planning.',
    },
    fields: [
      {
        type: 'textarea',
        name: 'lede',
        label: 'Lede',
      },
      {
        type: 'textarea',
        name: 'coreStory',
        label: 'Core Story',
      },
      {
        type: 'textarea',
        name: 'voices',
        label: 'Voices / Perspectives',
      },
      {
        type: 'textarea',
        name: 'analysis',
        label: 'Analysis / Context',
      },
      {
        type: 'textarea',
        name: 'impact',
        label: 'Impact / Why It Matters',
      },
      {
        type: 'textarea',
        name: 'future',
        label: 'What’s Next',
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
      description: 'Sources, references, acknowledgements, and reporting credits.',
    },
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
      description: 'Prevent this feature from appearing in search.',
    },
  },
]
