import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const sponsoredContentFields: Field[] = [
  /* ============================================================
     SPONSOR IDENTIFICATION
     (FTC / Legal critical)
  ============================================================ */

  {
    type: 'text',
    name: 'sponsor',
    label: 'Sponsor Name',
    required: true,
    admin: {
      description: 'Legal name of the sponsoring brand or organization.',
    },
  },

  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    admin: {
      description: 'Optional secondary headline for sponsored content.',
    },
  },

  {
    type: 'relationship',
    name: 'category',
    relationTo: 'categories',
    required: true,
    admin: {
      description: 'Primary category for sponsored content.',
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
     MANDATORY DISCLOSURE
     ⚠ REQUIRED BY POLICY
  ============================================================ */

  {
    type: 'textarea',
    name: 'disclosure',
    label: 'Disclosure',
    required: true,
    defaultValue:
      'This article is produced in partnership with [Brand]. All opinions expressed are editorially independent.',
    admin: {
      description: 'Required disclosure statement for sponsored content.',
    },
    validate: (val) => {
      if (typeof val !== 'string' || val.trim().length < 20) {
        return 'Disclosure must clearly state the sponsored relationship.'
      }
      return true
    },
  },

  /* ============================================================
     MAIN BODY — BLOCK EDITOR
     ⚠ Used by readingTime, moderation, search indexing
  ============================================================ */

  {
    type: 'blocks',
    name: 'content',
    label: 'Sponsored Content Body',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for story integration, imagery, testimonials, product highlights, embeds, and more.',
    },
  },

  /* ============================================================
     CALL TO ACTION
     (Conversion tracking / campaigns)
  ============================================================ */

  {
    type: 'group',
    name: 'cta',
    label: 'Call To Action',
    admin: {
      description: 'Optional conversion or campaign call-to-action.',
    },
    fields: [
      {
        type: 'text',
        name: 'text',
        label: 'CTA Text',
        admin: {
          placeholder: 'Learn more, Shop now, Register, etc.',
        },
      },
      {
        type: 'text',
        name: 'url',
        label: 'CTA Link',
        admin: {
          placeholder: 'https://…',
        },
      },
      {
        type: 'date',
        name: 'eventDate',
        label: 'Event Date (Optional)',
        admin: {
          description: 'Optional event or campaign date.',
        },
      },
      {
        type: 'textarea',
        name: 'productInfo',
        label: 'Product Info (Optional)',
        admin: {
          description: 'Optional product or service details.',
        },
      },
    ],
  },

  /* ============================================================
     BRAND ASSETS
  ============================================================ */

  {
    type: 'array',
    name: 'assets',
    label: 'Brand Assets',
    admin: {
      description: 'Brand-approved images or creative assets.',
    },
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
        admin: {
          description: 'Accessibility text for the asset image.',
        },
      },
    ],
  },

  /* ============================================================
     INTERNAL / COMPLIANCE (NON-PUBLIC)
     Safe additions – no migrations
  ============================================================ */

  {
    type: 'checkbox',
    name: 'sponsorApproved',
    label: 'Sponsor Approved',
    defaultValue: false,
    admin: {
      description: 'Confirms sponsor has approved final content.',
      position: 'sidebar',
    },
  },

  {
    type: 'checkbox',
    name: 'legalReviewed',
    label: 'Legal Reviewed',
    defaultValue: false,
    admin: {
      description: 'Indicates legal/compliance review is complete.',
      position: 'sidebar',
    },
  },

  {
    type: 'textarea',
    name: 'internalNotes',
    label: 'Internal Notes',
    admin: {
      description: 'Internal editorial, legal, or sales notes (not public).',
    },
  },
]
