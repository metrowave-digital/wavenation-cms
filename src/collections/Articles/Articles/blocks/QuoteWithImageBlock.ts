import type { Block } from 'payload'

export const QuoteWithImageBlock: Block = {
  slug: 'quoteWithImage',
  labels: { singular: 'Quote w/ Image', plural: 'Quotes w/ Image' },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'position',
      type: 'select',
      label: 'Image Position',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'right',
    },
  ],
}
