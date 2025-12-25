import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const breakingNewsFields: Field[] = [
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
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
  },

  {
    type: 'relationship',
    name: 'tags',
    label: 'Tags',
    relationTo: 'tags',
    hasMany: true,
  },

  /* ============================================================
     HIGH-PRIORITY BREAKING DETAILS
     (Used for alerts, feeds, push, tickers)
  ============================================================ */

  {
    type: 'text',
    name: 'summary',
    label: 'What Happened — 1–2 Sentence Summary',
    required: true,
    admin: {
      description:
        'Extremely concise factual summary. Used for alerts, banners, and breaking tickers.',
    },
  },

  {
    type: 'text',
    name: 'confirmedDetails',
    label: 'Confirmed Details',
    hasMany: true,
    admin: {
      description: 'Each entry must be ONE independently verified fact.',
    },
  },

  {
    type: 'text',
    name: 'notYetConfirmed',
    label: 'Unverified / Pending Confirmation',
    hasMany: true,
    admin: {
      description: 'Clearly label information that is still developing.',
    },
  },

  {
    type: 'text',
    name: 'statements',
    label: 'Official Statements',
    hasMany: true,
    admin: {
      description:
        'Formal statements from authorities, organizers, or verified representatives only.',
    },
  },

  {
    type: 'text',
    name: 'updates',
    label: 'Live Updates',
    hasMany: true,
    admin: {
      description: 'Chronological breaking updates as the story evolves.',
    },
  },

  /* ============================================================
     FULL STORY BODY — BLOCKS
     Optional at first, expands as reporting develops
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Full Story Body',
    blocks: articleBlocks,
    required: false,
    admin: {
      description:
        'Use blocks for extended reporting, embeds, photos, pull quotes, timelines, and context.',
    },
  },

  /* ============================================================
     SOCIAL / DISTRIBUTION COPY
  ============================================================ */

  {
    type: 'text',
    name: 'socialCopyTwitter',
    label: 'Social Copy — Twitter / X',
    admin: {
      description: 'Short breaking headline (character-limited).',
    },
  },

  {
    type: 'textarea',
    name: 'socialCopyInstagram',
    label: 'Social Copy — Instagram',
    admin: {
      description: 'Caption-style breaking summary.',
    },
  },

  /* ============================================================
     OPTIONAL: NEWSROOM CONTROL FIELDS
     (Safe additions — no migrations)
  ============================================================ */

  {
    type: 'checkbox',
    name: 'isDeveloping',
    label: 'Developing Story',
    defaultValue: true,
    admin: {
      position: 'sidebar',
      description: 'Marks this story as actively developing.',
    },
  },

  {
    type: 'textarea',
    name: 'editorialContext',
    label: 'Internal Editorial Context',
    admin: {
      position: 'sidebar',
      description: 'Internal notes for editors — never published.',
    },
  },
]
