import type { CollectionConfig } from 'payload'

export const ReviewReactions: CollectionConfig = {
  slug: 'review-reactions',

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
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
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
