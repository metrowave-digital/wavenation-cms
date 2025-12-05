import type { Block } from 'payload'

export const InteractivePollBlock: Block = {
  slug: 'interactivePoll',
  labels: { singular: 'Interactive Poll', plural: 'Interactive Polls' },
  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
    },
    {
      name: 'showResultsInline',
      type: 'checkbox',
      label: 'Show Results Inside Article',
      defaultValue: true,
    },
  ],
}
