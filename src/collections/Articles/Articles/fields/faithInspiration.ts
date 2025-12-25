import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const faithInspirationFields: Field[] = [
  /* ============================================================
     BASIC METADATA
  ============================================================ */

  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    admin: {
      description: 'Optional secondary headline or devotional theme.',
    },
  },

  {
    type: 'relationship',
    name: 'category',
    relationTo: 'categories',
    required: true,
    admin: {
      description: 'Primary category for this faith or inspirational piece.',
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
    label: 'Devotional Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for Scripture, reflection, devotional message, application, prayer, quotes, imagery, and callouts.',
    },
  },

  /* ============================================================
     DEVOTIONAL FRAMEWORK (OPTIONAL)
     Structured faith flow without limiting creativity
  ============================================================ */

  {
    type: 'group',
    name: 'devotionalFramework',
    label: 'Devotional Framework (Optional)',
    admin: {
      description: 'Optional structure for devotionals, reflections, and inspirational teachings.',
    },
    fields: [
      {
        type: 'textarea',
        name: 'scripture',
        label: 'Scripture',
        admin: {
          description: 'Primary scripture or sacred text reference.',
        },
      },
      {
        type: 'textarea',
        name: 'reflection',
        label: 'Reflection',
        admin: {
          description: 'Opening reflection or meditation.',
        },
      },
      {
        type: 'textarea',
        name: 'message',
        label: 'Core Message',
        admin: {
          description: 'Central devotional or inspirational message.',
        },
      },
      {
        type: 'textarea',
        name: 'application',
        label: 'Life Application',
        admin: {
          description: 'How this message applies to daily life.',
        },
      },
      {
        type: 'textarea',
        name: 'prayerOrAffirmation',
        label: 'Prayer / Affirmation',
        admin: {
          description: 'Closing prayer, affirmation, or benediction.',
        },
      },
    ],
  },

  /* ============================================================
     CULTURAL / TRADITIONAL CONTEXT (OPTIONAL)
     Supports liberation theology, Sankofa, etc.
  ============================================================ */

  {
    type: 'textarea',
    name: 'culturalContext',
    label: 'Cultural / Spiritual Context',
    admin: {
      description:
        'Optional cultural, historical, or spiritual context (e.g., African spirituality, liberation theology, Sankofa).',
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
      description: 'Optional excerpt used in devotion lists, feeds, and search results.',
    },
  },

  {
    type: 'checkbox',
    name: 'excludeFromSearch',
    label: 'Exclude from Search',
    defaultValue: false,
    admin: {
      position: 'sidebar',
      description: 'Prevent this devotional from appearing in search results.',
    },
  },
]
