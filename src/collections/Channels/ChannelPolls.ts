// src/collections/ChannelPolls.ts
import type { CollectionConfig } from 'payload'

export const ChannelPolls: CollectionConfig = {
  slug: 'channel-polls',

  admin: {
    useAsTitle: 'question',
    group: 'Creator Channels',
    defaultColumns: ['question', 'channel', 'status', 'visibility'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'channel', type: 'relationship', relationTo: 'creator-channels', required: true },
    { name: 'question', type: 'text', required: true },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
    },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'subscribers',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'Tier-Restricted', value: 'tiers' },
      ],
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: { condition: (data) => data?.visibility === 'tiers' },
    },

    {
      name: 'options',
      type: 'array',
      required: true,
      labels: { singular: 'Option', plural: 'Options' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        {
          name: 'voteCount',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
      ],
    },

    /* RESULTS BREAKDOWN */
    {
      name: 'results',
      type: 'group',
      admin: {
        description: 'Aggregated metrics for analytics & dashboards.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'totalVotes', type: 'number', defaultValue: 0, admin: { width: '33%' } },
            { name: 'uniqueVoters', type: 'number', defaultValue: 0, admin: { width: '33%' } },
            {
              name: 'participationRate',
              type: 'number',
              admin: { width: '33%', description: '0–1 fraction of eligible viewers' },
            },
          ],
        },
        {
          name: 'byTier',
          type: 'json',
          admin: { description: 'Breakdown of votes by creator tier.' },
        },
        {
          name: 'byGeo',
          type: 'json',
          admin: { description: 'Optional breakdown by geography.' },
        },
        {
          name: 'byDevice',
          type: 'json',
          admin: { description: 'Optional breakdown by device (mobile, web, tv).' },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        { name: 'startAt', type: 'date', admin: { width: '50%' } },
        { name: 'endAt', type: 'date', admin: { width: '50%' } },
      ],
    },

    {
      name: 'showResults',
      type: 'select',
      defaultValue: 'after-vote',
      options: [
        { label: 'Always', value: 'always' },
        { label: 'After Vote', value: 'after-vote' },
        { label: 'After Poll Ends', value: 'after-end' },
      ],
    },
  ],
}
