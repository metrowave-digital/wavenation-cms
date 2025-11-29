// src/collections/ChannelAnalytics.ts
import type { CollectionConfig } from 'payload'

export const ChannelAnalytics: CollectionConfig = {
  slug: 'channel-analytics',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Channels',
    defaultColumns: ['channel', 'date', 'scope'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('system') || req.user?.roles?.includes('admin')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('system') || req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'channel', type: 'relationship', relationTo: 'creator-channels', required: true },

    {
      name: 'scope',
      type: 'select',
      defaultValue: 'daily',
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Lifetime Snapshot', value: 'lifetime' },
      ],
    },

    { name: 'date', type: 'date', required: true },

    /* CORE METRICS */
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'uniqueViewers',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'watchTimeMinutes',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Total watch time (minutes) across all content' },
    },

    {
      name: 'averageViewDurationSeconds',
      type: 'number',
      defaultValue: 0,
    },

    /* SUBSCRIBERS */
    {
      name: 'subscribersGained',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'subscribersLost',
      type: 'number',
      defaultValue: 0,
    },

    /* ENGAGEMENT */
    {
      name: 'engagement',
      type: 'group',
      fields: [
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'comments', type: 'number', defaultValue: 0 },
        { name: 'shares', type: 'number', defaultValue: 0 },
        { name: 'pollVotes', type: 'number', defaultValue: 0 },
        { name: 'chatMessages', type: 'number', defaultValue: 0 },
      ],
    },

    /* REVENUE ATTRIBUTION */
    {
      name: 'revenue',
      type: 'group',
      fields: [
        { name: 'subscriptions', type: 'number', defaultValue: 0 },
        { name: 'contentPurchases', type: 'number', defaultValue: 0 },
        { name: 'tips', type: 'number', defaultValue: 0 },
        { name: 'ads', type: 'number', defaultValue: 0 },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
        },
      ],
    },

    /* BREAKDOWNS */
    {
      name: 'breakdowns',
      type: 'json',
      admin: {
        description: 'Optional breakdown by content type, device, geography, etc.',
      },
    },
  ],
}
