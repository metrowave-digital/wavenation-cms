import type { Block } from 'payload'

export const QuoteWithImageBlock: Block = {
  slug: 'quoteWithImage',
  labels: {
    singular: 'Quote w/ Image',
    plural: 'Quotes w/ Image',
  },

  fields: [
    /* ============================================================
       QUOTE CONTENT
    ============================================================ */

    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The quoted text to be highlighted.',
      },
    },

    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Who said this quote (person, organization, or source).',
      },
    },

    {
      name: 'sourceTitle',
      type: 'text',
      admin: {
        description: 'Optional title or role of the quoted source.',
      },
    },

    /* ============================================================
       IMAGE
    ============================================================ */

    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image associated with the quote (portrait, context image).',
      },
    },

    {
      name: 'imageAlt',
      type: 'text',
      admin: {
        description: 'Accessibility text for the image.',
      },
    },

    /* ============================================================
       LAYOUT
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'position',
          type: 'select',
          label: 'Image Position',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          name: 'emphasis',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Highlight', value: 'highlight' },
            { label: 'Pull Quote', value: 'pull' },
          ],
          admin: {
            description: 'Controls visual emphasis in the layout.',
          },
        },
      ],
    },

    /* ============================================================
       CONTEXT / ATTRIBUTION
    ============================================================ */

    {
      name: 'context',
      type: 'textarea',
      admin: {
        description: 'Optional editorial context for when or why this quote appears.',
      },
    },

    {
      name: 'citation',
      type: 'text',
      admin: {
        description: 'Optional citation or reference (publication, speech, interview).',
      },
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional screen-reader label for the quote block.',
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
