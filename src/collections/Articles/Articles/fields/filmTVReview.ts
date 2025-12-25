import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const filmTVReviewFields: Field[] = [
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
      description: 'Primary category for this film or TV review.',
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
     MAIN REVIEW BODY (BLOCK-BASED)
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Review Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, plot summary, creative analysis, cultural themes, verdict, embeds, screenshots, and more.',
    },
  },

  /* ============================================================
     RATING (EDITORIAL CANON)
  ============================================================ */

  {
    type: 'number',
    name: 'rating',
    label: 'Rating (1–10)',
    required: true,
    min: 1,
    max: 10,
    admin: {
      width: '33%',
      description: 'WaveNation rating scale (1–10).',
    },
  },

  {
    type: 'select',
    name: 'ratingTone',
    label: 'Rating Tone',
    defaultValue: 'neutral',
    options: [
      { label: 'Classic', value: 'classic' },
      { label: 'Neutral', value: 'neutral' },
      { label: 'Harsh', value: 'harsh' },
      { label: 'Celebratory', value: 'celebratory' },
    ],
    admin: {
      width: '33%',
      description: 'Editorial tone of the review.',
    },
  },

  /* ============================================================
     STRUCTURED ANALYSIS (OPTIONAL)
     Complements block content for summaries & search
  ============================================================ */

  {
    type: 'group',
    name: 'analysis',
    label: 'Review Breakdown',
    admin: {
      description: 'Optional structured analysis used for previews, snippets, and search.',
    },
    fields: [
      {
        type: 'textarea',
        name: 'direction',
        label: 'Direction',
      },
      {
        type: 'textarea',
        name: 'acting',
        label: 'Acting / Performances',
      },
      {
        type: 'textarea',
        name: 'cinematography',
        label: 'Cinematography / Visuals',
      },
      {
        type: 'textarea',
        name: 'writing',
        label: 'Writing / Screenplay',
      },
      {
        type: 'textarea',
        name: 'themes',
        label: 'Themes & Messaging',
      },
      {
        type: 'textarea',
        name: 'culturalImpact',
        label: 'Cultural Impact',
      },
      {
        type: 'textarea',
        name: 'verdict',
        label: 'Final Verdict',
      },
    ],
  },

  /* ============================================================
     OPTIONAL RELATIONS
  ============================================================ */

  {
    type: 'relationship',
    name: 'relatedShow',
    label: 'Related Show',
    relationTo: 'shows',
    hasMany: true,
    admin: {
      description: 'Related TV shows for discovery and cross-linking.',
    },
  },

  {
    type: 'relationship',
    name: 'relatedFilm',
    label: 'Related Film',
    relationTo: 'films',
    hasMany: true,
    admin: {
      description: 'Related films for discovery and cross-linking.',
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
      description: 'Prevent this review from appearing in search.',
    },
  },
]
