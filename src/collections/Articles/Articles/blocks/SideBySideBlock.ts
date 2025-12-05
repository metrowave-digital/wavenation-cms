import type { Block } from 'payload'

export const SideBySideBlock: Block = {
  slug: 'sideBySide',
  labels: { singular: 'Side by Side', plural: 'Side by Side Blocks' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'left',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'right',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    { name: 'caption', type: 'textarea' },
  ],
}
