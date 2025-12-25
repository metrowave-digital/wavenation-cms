import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },

  fields: [
    /* ============================================================
       IMAGE SOURCE
    ============================================================ */

    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Select an image from the media library.',
      },
    },

    /* ============================================================
       ACCESSIBILITY (RECOMMENDED)
    ============================================================ */

    {
      name: 'altText',
      type: 'text',
      admin: {
        description: 'Alternative text for screen readers and accessibility.',
      },
    },

    /* ============================================================
       CAPTION & ATTRIBUTION
    ============================================================ */

    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption displayed below the image.',
      },
    },

    {
      name: 'attribution',
      type: 'text',
      admin: {
        description: 'Photographer, source, or organization credit.',
      },
    },

    /* ============================================================
       LICENSING / RIGHTS MANAGEMENT
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'licenseType',
          type: 'select',
          defaultValue: 'owned',
          options: [
            { label: 'Owned', value: 'owned' },
            { label: 'Licensed', value: 'licensed' },
            { label: 'Creative Commons', value: 'cc' },
            { label: 'Public Domain', value: 'public-domain' },
            { label: 'Fair Use', value: 'fair-use' },
          ],
          admin: {
            description: 'Usage rights for this image.',
          },
        },
        {
          name: 'licenseSource',
          type: 'text',
          admin: {
            description: 'Source or license URL (e.g., Getty, Unsplash, contract).',
          },
        },
      ],
    },

    {
      name: 'licenseExpiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration date for licensed images.',
      },
    },

    /* ============================================================
       DISPLAY OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Full Width', value: 'full' },
          ],
          admin: {
            description: 'Controls how the image is positioned in the layout.',
          },
        },
        {
          name: 'aspectRatio',
          type: 'select',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '1:1 (Square)', value: '1:1' },
            { label: '4:3', value: '4:3' },
            { label: '16:9', value: '16:9' },
          ],
          defaultValue: 'auto',
        },
      ],
    },

    /* ============================================================
       EDITORIAL FLAGS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'isHeroCandidate',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Marks this image as suitable for hero placement.',
          },
        },
        {
          name: 'hideCaption',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Hide caption in frontend rendering.',
          },
        },
      ],
    },

    /* ============================================================
       ACCESSIBILITY / SEO SUPPORT
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional ARIA label for assistive technologies.',
      },
    },

    /* ============================================================
       INTERNAL (NON-RENDERED)
    ============================================================ */

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial or legal notes (not public).',
      },
    },
  ],
}
