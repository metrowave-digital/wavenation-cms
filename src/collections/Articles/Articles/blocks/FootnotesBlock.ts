import type { Block } from 'payload'

export const FootnotesBlock: Block = {
  slug: 'footnotes',
  labels: { singular: 'Footnote', plural: 'Footnotes' },
  fields: [
    {
      type: 'array',
      name: 'notes',
      label: 'Footnotes',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'content', type: 'textarea', required: true },
      ],
    },
  ],
}
