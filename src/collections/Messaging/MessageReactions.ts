import type { CollectionConfig } from 'payload'

export const MessageReactions: CollectionConfig = {
  slug: 'message-reactions',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: 'reaction',
      type: 'relationship',
      relationTo: 'reactions',
      required: true,
    },
    {
      name: 'message',
      type: 'relationship',
      relationTo: 'messages',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
  ],
}
