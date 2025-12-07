import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const interviewFields: Field[] = [
  // -----------------------------------------
  // BASIC METADATA
  // -----------------------------------------
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
  },

  {
    type: 'relationship',
    name: 'category',
    relationTo: 'categories',
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    relationTo: 'categories',
  },

  {
    type: 'relationship',
    name: 'author',
    relationTo: 'profiles',
    required: true,
  },

  {
    type: 'relationship',
    name: 'podcast',
    relationTo: 'podcast-episodes',
  },

  {
    type: 'relationship',
    name: 'musicVideo',
    relationTo: 'media',
  },

  {
    type: 'relationship',
    name: 'interviewVideo',
    relationTo: 'media',
  },

  // -----------------------------------------
  // BLOCK-BASED INTRO & CONTEXT
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Interview Intro & Context',
    required: false,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, background, photos, pull quotes, and context before the Q&A.',
    },
  },

  // -----------------------------------------
  // INTERVIEW Q&A (structured)
  // -----------------------------------------
  {
    type: 'array',
    name: 'interview',
    label: 'Interview Q&A',
    labels: {
      singular: 'Q&A Entry',
      plural: 'Q&A Entries',
    },
    required: true,
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
    ],
  },

  // -----------------------------------------
  // POST-INTERVIEW NOTES (block-based)
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'closing',
    label: 'Closing Notes / Additional Content',
    required: false,
    blocks: articleBlocks,
  },

  // -----------------------------------------
  // SIDEBAR GROUP
  // -----------------------------------------
  {
    type: 'group',
    name: 'sidebar',
    label: 'Sidebar',
    fields: [
      {
        type: 'array',
        name: 'socialLinks',
        label: 'Social Links',
        fields: [
          { type: 'text', name: 'platform', required: true },
          { type: 'text', name: 'url', required: true },
        ],
      },
      {
        type: 'array',
        name: 'tourDates',
        label: 'Tour Dates',
        fields: [{ type: 'text', name: 'date' }],
      },
      {
        type: 'array',
        name: 'releases',
        label: 'Releases',
        fields: [{ type: 'text', name: 'release' }],
      },
    ],
  },

  // -----------------------------------------
  // RELATED ARTISTS
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'relatedArtists',
    label: 'Related Artist(s)',
    relationTo: 'profiles',
    hasMany: true,
  },
]
