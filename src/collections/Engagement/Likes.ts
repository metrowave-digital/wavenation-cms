import type { CollectionConfig } from 'payload'

export const Likes: CollectionConfig = {
  slug: 'likes',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['user', 'mediaType', 'createdAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        'tracks',
        'albums',
        'films',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'vod',
        'articles',
        'reviews',
        'comments',
        'playlists',
      ].map((x) => ({ label: x, value: x })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'films',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'vod',
        'articles',
        'reviews',
        'comments',
        'playlists',
      ],
      required: true,
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) data.createdBy = req.user.id
        return data
      },
    ],
  },
}
