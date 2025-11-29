import type { CollectionConfig } from 'payload'

export const CommentReactions: CollectionConfig = {
  slug: 'comment-reactions',

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
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
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
