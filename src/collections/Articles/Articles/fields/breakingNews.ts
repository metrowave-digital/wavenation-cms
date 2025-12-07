import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const breakingNewsFields: Field[] = [
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

  // -----------------------------------------
  // HIGH-PRIORITY BREAKING DETAILS
  // -----------------------------------------
  {
    type: 'text',
    name: 'summary',
    label: 'What Happened — 1–2 Sentence Summary',
    admin: {
      description: 'Keep extremely concise.',
    },
    required: true,
  },

  {
    type: 'text',
    name: 'confirmedDetails',
    label: 'Confirmed Details',
    hasMany: true,
    admin: {
      description: 'Each entry is ONE verified fact.',
    },
  },

  {
    type: 'text',
    name: 'notYetConfirmed',
    label: 'Unverified / Pending Confirmation',
    hasMany: true,
    admin: {
      description: 'Short bullet-style entries only.',
    },
  },

  {
    type: 'text',
    name: 'statements',
    label: 'Official Statements',
    hasMany: true,
    admin: {
      description: 'Only formal statements from authorities or PR.',
    },
  },

  {
    type: 'text',
    name: 'updates',
    label: 'Live Updates',
    hasMany: true,
    admin: {
      description: 'Add breaking updates as the story evolves.',
    },
  },

  // -----------------------------------------
  // MAIN BODY — now uses BLOCKS
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Full Story Body',
    blocks: articleBlocks,
    required: false,
    admin: {
      description: 'Use this for extended reporting, embeds, images, quotes, etc.',
    },
  },

  // -----------------------------------------
  // SOCIAL COPY
  // -----------------------------------------
  {
    type: 'text',
    name: 'socialCopyTwitter',
    label: 'Social Copy — Twitter/X',
  },
  {
    type: 'textarea',
    name: 'socialCopyInstagram',
    label: 'Social Copy — Instagram Caption',
  },
]
