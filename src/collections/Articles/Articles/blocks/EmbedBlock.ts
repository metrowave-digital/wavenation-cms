import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    {
      type: 'text',
      name: 'embedUrl',
      label: 'Embed URL',
      required: true,
    },
    {
      type: 'textarea',
      name: 'caption',
    },
  ],
}
