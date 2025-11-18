import type { CollectionConfig } from 'payload'

export const PollItems: CollectionConfig = {
  slug: 'poll-items',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'poll', 'votes'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'votes',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional: Upload an icon or image for this poll option.',
      },
    },
  ],
}
