import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['author', 'mediaType', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'approved',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Flagged', value: 'flagged' },
        { label: 'Removed', value: 'removed' },
      ],
    },

    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      admin: { description: 'Threaded comment support' },
    },

    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        'tracks',
        'albums',
        'podcasts',
        'podcast-episodes',
        'vod',
        'films',
        'shows',
        'episodes',
        'articles',
        'reviews',
      ].map((m) => ({ label: m, value: m })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'podcasts',
        'podcast-episodes',
        'vod',
        'films',
        'shows',
        'episodes',
        'articles',
        'reviews',
      ],
      required: true,
    },

    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'comment-reactions',
      hasMany: true,
    },

    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'AI-generated toxicity score (0–1). Used for moderation.',
      },
    },
    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Automatically flagged when toxicity exceeds threshold.',
      },
    },
  ],
}
