import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const eventRecapFields: Field[] = [
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
      description: 'Primary category for this event recap.',
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
     HIGHLIGHTS (SHORT BULLETS)
  ============================================================ */

  {
    type: 'text',
    name: 'highlights',
    label: 'Highlights',
    hasMany: true,
    admin: {
      description: 'Key standout moments, performances, or takeaways.',
    },
  },

  /* ============================================================
     MAIN BODY — BLOCK-BASED
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Event Recap Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks to build the recap: intro, atmosphere, performances, visuals, cultural moments, and closing notes.',
    },
  },

  /* ============================================================
     EVENT CONTEXT (OPTIONAL)
     Structured recap metadata without constraining narrative
  ============================================================ */

  {
    type: 'group',
    name: 'eventContext',
    label: 'Event Context (Optional)',
    admin: {
      description: 'Optional structured context for previews, summaries, and feeds.',
    },
    fields: [
      {
        type: 'text',
        name: 'location',
        label: 'Location',
      },
      {
        type: 'date',
        name: 'eventDate',
        label: 'Event Date',
      },
      {
        type: 'textarea',
        name: 'atmosphere',
        label: 'Atmosphere',
      },
      {
        type: 'textarea',
        name: 'culturalTakeaways',
        label: 'Cultural Takeaways',
      },
    ],
  },

  /* ============================================================
     PHOTO GALLERY
     (Retains array — Postgres safe)
  ============================================================ */

  {
    type: 'array',
    name: 'photos',
    label: 'Photos',
    labels: {
      singular: 'Photo',
      plural: 'Photos',
    },
    admin: {
      description: 'Event photography with accessibility text.',
    },
    fields: [
      {
        type: 'upload',
        name: 'image',
        label: 'Image',
        relationTo: 'media',
        required: true,
      },
      {
        type: 'text',
        name: 'alt',
        label: 'Alt Text',
        required: true,
        admin: {
          description: 'Accessibility description for the photo.',
        },
      },
      {
        type: 'text',
        name: 'credit',
        label: 'Photo Credit',
        admin: {
          description: 'Optional photographer or source credit.',
        },
      },
    ],
  },

  /* ============================================================
     RELATED EVENTS
  ============================================================ */

  {
    type: 'relationship',
    name: 'relatedEvents',
    label: 'Related Events (Optional)',
    relationTo: 'events',
    hasMany: true,
    admin: {
      description: 'Related or previous events for cross-linking.',
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
      description: 'Prevent this recap from appearing in search.',
    },
  },
]
