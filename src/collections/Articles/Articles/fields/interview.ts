import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const interviewFields: Field[] = [
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
      description: 'Primary category for this interview.',
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
      description: 'Interviewer or author.',
    },
  },

  /* ============================================================
     RELATED MEDIA (OPTIONAL)
  ============================================================ */

  {
    type: 'relationship',
    name: 'podcast',
    relationTo: 'podcast-episodes',
    admin: {
      description: 'Optional related podcast episode.',
    },
  },

  {
    type: 'relationship',
    name: 'musicVideo',
    relationTo: 'media',
    admin: {
      description: 'Optional related music video.',
    },
  },

  {
    type: 'relationship',
    name: 'interviewVideo',
    relationTo: 'media',
    admin: {
      description: 'Optional full interview video.',
    },
  },

  /* ============================================================
     INTRO / CONTEXT (BLOCK-BASED)
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Interview Intro & Context',
    blocks: articleBlocks,
    admin: {
      description: 'Intro, background, photos, pull quotes, and context before the Q&A.',
    },
  },

  /* ============================================================
     INTERVIEW Q&A (STRUCTURED)
  ============================================================ */

  {
    type: 'array',
    name: 'interview',
    label: 'Interview Q&A',
    labels: {
      singular: 'Q&A Entry',
      plural: 'Q&A Entries',
    },
    required: true,
    admin: {
      description: 'Structured interview questions and answers.',
    },
    fields: [
      {
        type: 'text',
        name: 'question',
        label: 'Question',
        required: true,
      },
      {
        type: 'textarea',
        name: 'answer',
        label: 'Answer',
        required: true,
      },
      {
        type: 'checkbox',
        name: 'highlight',
        label: 'Highlight Quote',
        defaultValue: false,
        admin: {
          description: 'Mark this answer as a highlight for pull quotes or social use.',
        },
      },
    ],
  },

  /* ============================================================
     POST-INTERVIEW CONTENT
  ============================================================ */

  {
    type: 'blocks',
    name: 'closing',
    label: 'Closing Notes / Additional Content',
    blocks: articleBlocks,
    admin: {
      description: 'Closing reflections, takeaways, embeds, or follow-ups.',
    },
  },

  /* ============================================================
     SIDEBAR (OPTIONAL)
  ============================================================ */

  {
    type: 'group',
    name: 'sidebar',
    label: 'Sidebar',
    admin: {
      description: 'Supplemental information about the interviewee.',
    },
    fields: [
      {
        type: 'array',
        name: 'socialLinks',
        dbName: 'sl',
        label: 'Social Links',
        fields: [
          {
            type: 'select',
            name: 'platform',
            dbName: 'sl_platform',
            options: [
              { label: 'Website', value: 'website' },
              { label: 'Instagram', value: 'instagram' },
              { label: 'X / Twitter', value: 'twitter' },
              { label: 'Facebook', value: 'facebook' },
              { label: 'YouTube', value: 'youtube' },
              { label: 'TikTok', value: 'tiktok' },
            ],
            required: true,
          },
          {
            type: 'text',
            name: 'url',
            required: true,
          },
        ],
      },
      {
        type: 'array',
        name: 'tourDates',
        label: 'Tour Dates',
        fields: [
          {
            type: 'text',
            name: 'date',
          },
        ],
      },
      {
        type: 'array',
        name: 'releases',
        label: 'Releases',
        fields: [
          {
            type: 'text',
            name: 'release',
          },
        ],
      },
    ],
  },

  /* ============================================================
     RELATED ARTISTS / PROFILES
  ============================================================ */

  {
    type: 'relationship',
    name: 'relatedArtists',
    label: 'Related Artist(s)',
    relationTo: 'profiles',
    hasMany: true,
    admin: {
      description: 'Artists or figures related to this interview.',
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
      description: 'Prevent this interview from appearing in search.',
    },
  },
]
