import type { CollectionConfig } from 'payload'

export const ContentScores: CollectionConfig = {
  slug: 'content-scores',

  labels: {
    singular: 'Content Score',
    plural: 'Content Scores',
  },

  admin: {
    group: 'Analytics',
    defaultColumns: ['target', 'finalScore', 'trendingScore', 'engagementRate', 'updatedAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'target',
      type: 'relationship',
      relationTo: [
        'posts',
        'videos',
        'tracks',
        'podcast-episodes',
        'shows',
        'podcasts',
        'creator-channels',
      ],
      required: true,
    },

    /* ALGORITHM SCORE LAYERS */

    {
      name: 'baseScore',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'trendingScore',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'qualityScore',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Long-term stability score: likes/views/comments normalized.',
      },
    },

    {
      name: 'engagementRate',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'finalScore',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Weighted score used for final ranking in recommendations.',
      },
    },

    {
      name: 'lastCalculatedAt',
      type: 'date',
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'views', type: 'number', defaultValue: 0 },
        { name: 'plays', type: 'number', defaultValue: 0 },
        { name: 'comments', type: 'number', defaultValue: 0 },
        { name: 'shares', type: 'number', defaultValue: 0 },
        { name: 'follows', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}

export default ContentScores
