import type { CollectionConfig } from 'payload'

export const Reactions: CollectionConfig = {
  slug: 'reactions',
  admin: {
    useAsTitle: 'label',
    group: 'Engagement',
    defaultColumns: ['label', 'emoji'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => false,
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'emoji',
      type: 'text',
      required: true,
      admin: { description: 'Emoji to display (🔥, 💯, 😂, ❤️, 👎)' },
    },
  ],
}
