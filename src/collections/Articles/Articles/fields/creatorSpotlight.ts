import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const creatorSpotlightFields: Field[] = [
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
    label: 'Category',
    relationTo: 'categories',
    admin: {
      description: 'Primary category for this Creator Spotlight.',
    },
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
    admin: {
      description: 'Optional sub-category.',
    },
  },

  {
    type: 'relationship',
    name: 'tags',
    label: 'Tags',
    relationTo: 'tags',
    hasMany: true,
    admin: {
      description: 'Tags for discovery and cross-linking.',
    },
  },

  /* ============================================================
     FEATURE BODY — BLOCKS
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Feature Body (Intro → Origin → Work → Vision)',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks to construct the spotlight narrative: intro, origin story, body of work, impact, and vision.',
    },
  },

  /* ============================================================
     SPOTLIGHT FRAMEWORK (OPTIONAL)
     Structured creator narrative without limiting blocks
  ============================================================ */

  {
    type: 'group',
    name: 'spotlightFramework',
    label: 'Spotlight Framework (Optional)',
    admin: {
      description: 'Optional structured fields used for summaries, previews, and feeds.',
    },
    fields: [
      {
        type: 'textarea',
        name: 'origin',
        label: 'Origin Story',
      },
      {
        type: 'textarea',
        name: 'work',
        label: 'Body of Work',
      },
      {
        type: 'textarea',
        name: 'vision',
        label: 'Vision / Future',
      },
      {
        type: 'textarea',
        name: 'alignment',
        label: 'Why This Creator Matters',
      },
    ],
  },

  /* ============================================================
     MEDIA ASSETS
     (Retains array + dbName — Postgres safe)
  ============================================================ */

  {
    type: 'array',
    name: 'mediaAssets',
    dbName: 'cs_media',
    label: 'Videos & Photos',
    admin: {
      description: 'Images or videos associated with this Creator Spotlight.',
    },
    fields: [
      {
        type: 'select',
        name: 'type',
        label: 'Media Type',
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
        required: true,
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

  /* ============================================================
     RELATED CREATOR / PROFILE (OPTIONAL)
  ============================================================ */

  {
    type: 'relationship',
    name: 'relatedCreator',
    label: 'Related Creator Profile',
    relationTo: 'profiles',
    admin: {
      description: 'Link to the primary creator profile if available.',
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
      description: 'Prevent this spotlight from appearing in search.',
    },
  },
]
