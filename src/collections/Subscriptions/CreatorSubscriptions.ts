import type { CollectionConfig } from 'payload'

export const CreatorSubscriptions: CollectionConfig = {
  slug: 'creator-subscriptions',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Economy',
    defaultColumns: ['subscriber', 'creator', 'tier', 'status'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    { name: 'creator', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'subscriber', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'tier', type: 'relationship', relationTo: 'creator-tiers', required: true },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'canceled', 'paused', 'past_due'].map((v) => ({ label: v, value: v })),
    },

    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },

    { name: 'stripeSubscriptionId', type: 'text' },
    { name: 'renewalAttempts', type: 'number', defaultValue: 0 },

    { name: 'metadata', type: 'json' },
  ],
}
