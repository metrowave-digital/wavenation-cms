import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },

  fields: [
    /* ============================================================
       MAIN CONTENT (LEXICAL)
       ⚠ DO NOT RENAME — used by readingTime, search, moderation
    ============================================================ */

    {
      name: 'content',
      type: 'richText',
      required: true,
    },

    /* ============================================================
       PRESENTATION OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'body',
          options: [
            { label: 'Body Text', value: 'body' },
            { label: 'Lede / Intro', value: 'lede' },
            { label: 'Sidebar', value: 'sidebar' },
            { label: 'Footnote', value: 'footnote' },
          ],
          admin: {
            description: 'Controls typography and spacing in the frontend.',
          },
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
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
        description: 'Optional accessibility label for screen readers.',
      },
    },

    /* ============================================================
       EDITORIAL FLAGS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'emphasizeFirstParagraph',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Visually emphasize the first paragraph.',
          },
        },
        {
          name: 'allowDropCap',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable a drop cap on the first letter.',
          },
        },
      ],
    },

    /* ============================================================
       SEARCH / MODERATION SUPPORT
       (NON-RENDERED)
    ============================================================ */

    {
      name: 'searchExcerpt',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated excerpt used for search previews.',
      },
    },

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial notes (not rendered publicly).',
      },
    },
  ],
}
