import type { Block } from 'payload'

export const DropcapParagraphBlock: Block = {
  slug: 'dropcap',
  labels: {
    singular: 'Dropcap Paragraph',
    plural: 'Dropcap Paragraphs',
  },

  fields: [
    /* ============================================================
       PARAGRAPH CONTENT
    ============================================================ */

    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Paragraph text. The first letter may be styled as a drop cap.',
      },
    },

    /* ============================================================
       DROP CAP OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'enableDropcap',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable drop cap styling for the first letter.',
          },
        },
        {
          name: 'dropcapStyle',
          type: 'select',
          defaultValue: 'classic',
          options: [
            { label: 'Classic', value: 'classic' },
            { label: 'Modern', value: 'modern' },
            { label: 'Outlined', value: 'outlined' },
          ],
          admin: {
            description: 'Visual style of the drop cap.',
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'dropcapSize',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          admin: {
            description: 'Relative size of the drop cap.',
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
            description: 'Controls paragraph emphasis and tone.',
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
        description: 'Optional screen-reader label for this paragraph.',
      },
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
        description: 'Optional excerpt used for search previews.',
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
