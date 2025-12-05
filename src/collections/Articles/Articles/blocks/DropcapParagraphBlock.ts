import type { Block } from 'payload'

export const DropcapParagraphBlock: Block = {
  slug: 'dropcap',
  labels: { singular: 'Dropcap Paragraph', plural: 'Dropcap Paragraphs' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
  ],
}
