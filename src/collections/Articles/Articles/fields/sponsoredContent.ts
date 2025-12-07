import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const sponsoredContentFields: Field[] = [
  // -----------------------------------------
  // SPONSOR IDENTIFICATION
  // -----------------------------------------
  {
    type: 'text',
    name: 'sponsor',
    label: 'Sponsor Name',
    required: true,
  },

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

  // -----------------------------------------
  // MANDATORY DISCLOSURE
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'disclosure',
    label: 'Disclosure',
    required: true,
    defaultValue:
      'This article is produced in partnership with [Brand]. All opinions expressed are editorially independent.',
  },

  // -----------------------------------------
  // MAIN BODY — full block editor
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Sponsored Content Body',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, story integration, imagery, testimonials, product highlights, embeds, and more.',
    },
  },

  // -----------------------------------------
  // CTA BLOCK
  // -----------------------------------------
  {
    type: 'group',
    name: 'cta',
    label: 'Call To Action',
    fields: [
      { type: 'text', name: 'text', label: 'CTA Text' },
      { type: 'text', name: 'url', label: 'CTA Link' },
      { type: 'date', name: 'eventDate', label: 'Event Date (Optional)' },
      {
        type: 'textarea',
        name: 'productInfo',
        label: 'Product Info (Optional)',
      },
    ],
  },

  // -----------------------------------------
  // BRAND-ASSETS
  // -----------------------------------------
  {
    type: 'array',
    name: 'assets',
    label: 'Brand Assets',
    fields: [
      {
        type: 'upload',
        name: 'image',
        relationTo: 'media',
        required: true,
      },
      {
        type: 'text',
        name: 'alt',
        required: true,
      },
    ],
  },
]
