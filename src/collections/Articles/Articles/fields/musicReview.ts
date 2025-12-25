import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const musicReviewFields: Field[] = [
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
      description: 'Primary category for this music review.',
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
      description: 'Reviewer or critic.',
    },
  },

  /* ============================================================
     MAIN REVIEW BODY
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
        'Use blocks for intro, production analysis, vocals, lyrics, cultural positioning, verdict, embeds, images, and more.',
    },
  },

  /* ============================================================
     RATING (EDITORIAL CANON)
  ============================================================ */

  {
    type: 'number',
    name: 'rating',
    label: 'Rating (1–10)',
    min: 1,
    max: 10,
    required: true,
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
     REVIEW BREAKDOWN (STRUCTURED ANALYSIS)
     Optional — complements block content
  ============================================================ */

  {
    type: 'group',
    name: 'analysis',
    label: 'Review Breakdown',
    admin: {
      description: 'Optional structured analysis used for summaries, snippets, and search.',
    },
    fields: [
      {
        type: 'textarea',
        name: 'soundProduction',
        label: 'Sound / Production',
      },
      {
        type: 'textarea',
        name: 'vocals',
        label: 'Vocal Performance',
      },
      {
        type: 'textarea',
        name: 'lyricsThemes',
        label: 'Lyrics & Themes',
      },
      {
        type: 'textarea',
        name: 'culturalContext',
        label: 'Cultural Positioning',
      },
      {
        type: 'textarea',
        name: 'verdict',
        label: 'Final Verdict',
      },
    ],
  },

  /* ============================================================
     TRACKLIST + RELATED MUSIC
  ============================================================ */

  {
    type: 'text',
    name: 'tracklist',
    label: 'Tracklist (Optional)',
    hasMany: true,
    admin: {
      description: 'Tracklist in order of appearance.',
    },
  },

  {
    type: 'relationship',
    name: 'relatedTracks',
    label: 'Related Tracks (Optional)',
    relationTo: 'tracks',
    hasMany: true,
    admin: {
      description: 'Tracks referenced or highlighted in the review.',
    },
  },

  {
    type: 'relationship',
    name: 'relatedAlbums',
    label: 'Related Albums (Optional)',
    relationTo: 'albums',
    hasMany: true,
    admin: {
      description: 'Related albums for discovery and cross-linking.',
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
