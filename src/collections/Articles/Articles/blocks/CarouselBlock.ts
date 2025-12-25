import type { Block } from 'payload'

export const CarouselBlock: Block = {
  slug: 'carousel',
  labels: {
    singular: 'Carousel',
    plural: 'Carousels',
  },

  fields: [
    /* ============================================================
       CAROUSEL META
    ============================================================ */

    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional headline displayed above the carousel.',
      },
    },

    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Optional context or explanation for the carousel.',
      },
    },

    /* ============================================================
       CAROUSEL ITEMS
    ============================================================ */

    {
      type: 'array',
      name: 'items',
      label: 'Carousel Items',
      required: true,
      minRows: 2,
      fields: [
        /* ---------------- MEDIA ---------------- */

        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Image or media item for this slide.',
          },
        },

        /* ---------------- ACCESSIBILITY ---------------- */

        {
          name: 'altText',
          type: 'text',
          admin: {
            description: 'Alternative text for accessibility.',
          },
        },

        /* ---------------- CAPTION / CREDIT ---------------- */

        {
          name: 'caption',
          type: 'textarea',
          admin: {
            description: 'Optional caption for this slide.',
          },
        },

        {
          name: 'attribution',
          type: 'text',
          admin: {
            description: 'Photographer or source credit.',
          },
        },

        /* ---------------- LICENSING ---------------- */

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
                description: 'Usage rights for this slide.',
              },
            },
            {
              name: 'licenseSource',
              type: 'text',
              admin: {
                description: 'Source or license URL.',
              },
            },
          ],
        },

        {
          name: 'licenseExpiresAt',
          type: 'date',
          admin: {
            description: 'Optional expiration date for licensed media.',
          },
        },

        /* ---------------- LINKS ---------------- */

        {
          name: 'linkUrl',
          type: 'text',
          admin: {
            placeholder: 'https://… or /articles/…',
            description: 'Optional link when this slide is clicked.',
          },
        },

        /* ---------------- INTERNAL ---------------- */

        {
          name: 'internalNotes',
          type: 'textarea',
          admin: {
            description: 'Internal notes for this slide (not public).',
          },
        },
      ],
    },

    /* ============================================================
       DISPLAY OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Full Width', value: 'full' },
            { label: 'Compact', value: 'compact' },
          ],
          admin: {
            description: 'Controls overall carousel layout.',
          },
        },
        {
          name: 'aspectRatio',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '1:1', value: '1:1' },
            { label: '4:3', value: '4:3' },
            { label: '16:9', value: '16:9' },
          ],
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'autoPlay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Automatically advance slides.',
          },
        },
        {
          name: 'autoPlayInterval',
          type: 'number',
          defaultValue: 5000,
          admin: {
            condition: (_, data) => Boolean((data as any)?.autoPlay),
            description: 'Delay (ms) between slide changes.',
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'showIndicators',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show slide indicators (dots).',
          },
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show previous/next navigation arrows.',
          },
        },
      ],
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional ARIA label for the carousel.',
      },
    },

    /* ============================================================
       ANALYTICS / TRACKING
    ============================================================ */

    {
      name: 'trackingId',
      type: 'text',
      admin: {
        description: 'Optional analytics identifier for carousel engagement.',
      },
    },

    /* ============================================================
       INTERNAL (NON-RENDERED)
    ============================================================ */

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial or technical notes (not public).',
      },
    },
  ],
}
