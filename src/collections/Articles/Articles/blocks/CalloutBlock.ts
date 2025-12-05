import type { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Callout Box', plural: 'Callout Boxes' },
  fields: [
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Highlight', value: 'highlight' },
      ],
      defaultValue: 'info',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
