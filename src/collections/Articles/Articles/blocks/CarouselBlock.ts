import type { Block } from 'payload'

export const CarouselBlock: Block = {
  slug: 'carousel',
  labels: { singular: 'Carousel', plural: 'Carousels' },
  fields: [
    {
      type: 'array',
      name: 'items',
      label: 'Carousel Items',
      required: true,
      minRows: 2,
      fields: [
        {
          type: 'upload',
          name: 'media',
          relationTo: 'media',
          required: true,
        },
        { name: 'caption', type: 'textarea' },
        { name: 'attribution', type: 'text' },
      ],
    },
  ],
}
