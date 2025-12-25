import type { Block } from 'payload'

export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: {
    singular: 'Pull Quote',
    plural: 'Pull Quotes',
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
        description: 'The highlighted quote text.',
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
       PRESENTATION
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
            description: 'Text alignment for the pull quote.',
          },
        },
        {
          name: 'emphasis',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Strong Emphasis', value: 'strong' },
            { label: 'Subtle Emphasis', value: 'subtle' },
          ],
          admin: {
            description: 'Controls visual weight and prominence.',
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
        description: 'Optional editorial context explaining why this quote matters.',
      },
    },

    {
      name: 'citation',
      type: 'text',
      admin: {
        description: 'Optional citation (interview, article, speech, date).',
      },
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional screen-reader label for this pull quote.',
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
