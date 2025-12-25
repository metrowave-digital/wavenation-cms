import type { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: {
    singular: 'Callout Box',
    plural: 'Callout Boxes',
  },

  fields: [
    /* ============================================================
       CALLOUT TYPE / STYLE
    ============================================================ */

    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Highlight', value: 'highlight' },
        { label: 'Scripture / Faith', value: 'faith' },
        { label: 'Cultural Note', value: 'culture' },
        { label: 'Editorial Note', value: 'editorial' },
      ],
      admin: {
        description: 'Controls visual style and semantic meaning of the callout.',
      },
    },

    /* ============================================================
       OPTIONAL TITLE / ICON
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Optional title displayed at the top of the callout.',
          },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Star', value: 'star' },
            { label: 'Quote', value: 'quote' },
            { label: 'Faith', value: 'faith' },
            { label: 'Culture', value: 'culture' },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Optional icon displayed with the callout.',
          },
        },
      ],
    },

    /* ============================================================
       CONTENT (LEXICAL)
       ⚠ DO NOT RENAME — used by moderation & readingTime
    ============================================================ */

    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main callout content (supports rich text).',
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
          ],
          admin: {
            description: 'Text alignment for the callout box.',
          },
        },
        {
          name: 'emphasis',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Strong', value: 'strong' },
            { label: 'Subtle', value: 'subtle' },
          ],
          admin: {
            description: 'Controls visual emphasis and prominence.',
          },
        },
      ],
    },

    /* ============================================================
       VISIBILITY / BEHAVIOR
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'dismissible',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow users to dismiss this callout (frontend-controlled).',
          },
        },
        {
          name: 'visibility',
          type: 'select',
          defaultValue: 'public',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Logged-in Users', value: 'authenticated' },
            { label: 'WaveNation+ Members', value: 'plus' },
          ],
          admin: {
            description: 'Controls who can see this callout.',
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
        description: 'Optional screen-reader label for the callout.',
      },
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
