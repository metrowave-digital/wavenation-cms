import { Field } from 'payload'

export const sponsoredContentFields: Field[] = [
  // -----------------------------------------
  // SPONSOR
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

  // -----------------------------------------
  // DISCLOSURE (Required, auto-filled)
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'disclosure',
    label: 'Disclosure',
    required: true,
    defaultValue:
      'This article is produced in partnership with [Brand]. All opinions expressed are editorially independent.',
    admin: {
      description: 'Required by WaveNation + FTC guidelines.',
    },
  },

  // -----------------------------------------
  // INTRO
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'intro',
    label: 'Intro',
    admin: {
      description: 'Brand context + cultural relevance. Why this story matters for our audience.',
    },
  },

  // -----------------------------------------
  // BODY
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'body',
    label: 'Body',
    admin: {
      description: 'Highlight the product, event, or activation.',
    },
  },

  // -----------------------------------------
  // STORY INTEGRATION
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'storyIntegration',
    label: 'Story Integration',
    admin: {
      description: 'Real customer stories, testimonials, or community connections.',
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
      {
        type: 'text',
        name: 'text',
        label: 'CTA Text',
        admin: { placeholder: 'Learn More, Buy Now, RSVP, etc.' },
      },
      {
        type: 'text',
        name: 'url',
        label: 'CTA Link',
      },
      {
        type: 'date',
        name: 'eventDate',
        label: 'Event Date (if applicable)',
      },
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
    label: 'Brand-Approved Visuals',
    labels: { singular: 'Asset', plural: 'Assets' },
    admin: {
      description: 'Upload only sponsor-approved photography or graphics.',
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
      },
    ],
  },
]
