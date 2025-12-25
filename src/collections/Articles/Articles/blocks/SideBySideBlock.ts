import type { Block } from 'payload'

export const SideBySideBlock: Block = {
  slug: 'sideBySide',
  labels: {
    singular: 'Side by Side',
    plural: 'Side by Side Blocks',
  },

  fields: [
    /* ============================================================
       MEDIA PAIR
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'left',
          label: 'Left Media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'right',
          label: 'Right Media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'leftAlt',
          label: 'Left Alt Text',
          type: 'text',
          admin: {
            description: 'Accessibility text for the left media.',
          },
        },
        {
          name: 'rightAlt',
          label: 'Right Alt Text',
          type: 'text',
          admin: {
            description: 'Accessibility text for the right media.',
          },
        },
      ],
    },

    /* ============================================================
       CAPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'leftCaption',
          label: 'Left Caption',
          type: 'textarea',
        },
        {
          name: 'rightCaption',
          label: 'Right Caption',
          type: 'textarea',
        },
      ],
    },

    /* ============================================================
       SHARED CAPTION
    ============================================================ */

    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption spanning both media items.',
      },
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
          defaultValue: 'equal',
          options: [
            { label: 'Equal Width', value: 'equal' },
            { label: 'Left Emphasis', value: 'left-heavy' },
            { label: 'Right Emphasis', value: 'right-heavy' },
          ],
          admin: {
            description: 'Controls visual balance between left and right media.',
          },
        },
        {
          name: 'stackOnMobile',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Stack media vertically on small screens.',
          },
        },
      ],
    },

    /* ============================================================
       INTERNAL (NON-RENDERED)
    ============================================================ */

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial notes (not shown publicly).',
      },
    },
  ],
}
