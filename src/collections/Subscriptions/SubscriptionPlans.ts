import type { CollectionConfig } from 'payload'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',

  admin: {
    group: 'Subscriptions',
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'interval', 'status'],
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    {
      name: 'interval',
      type: 'select',
      required: true,
      options: ['monthly', 'yearly'].map((v) => ({ label: v, value: v })),
    },
    { name: 'price', type: 'number', required: true },
    { name: 'benefits', type: 'array', fields: [{ name: 'text', type: 'text' }] },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'hidden', 'archived'].map((v) => ({ label: v, value: v })),
    },
    { name: 'stripeProductId', type: 'text' },
    { name: 'stripePriceId', type: 'text' },
  ],
}
