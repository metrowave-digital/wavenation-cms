import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',

  admin: {
    group: 'Subscriptions',
    useAsTitle: 'id',
    defaultColumns: ['user', 'plan', 'status'],
  },

  fields: [
    { name: 'user', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'plan', type: 'relationship', relationTo: 'subscription-plans', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'trialing', 'past_due', 'canceled'].map((v) => ({ label: v, value: v })),
    },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'stripeSubscriptionId', type: 'text' },
    { name: 'renewalAttempts', type: 'number', defaultValue: 0 },
  ],
}
