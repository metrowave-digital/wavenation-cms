import type { CollectionConfig } from 'payload'

export const PaidSubscriptions: CollectionConfig = {
  slug: 'paid-subscriptions',

  labels: {
    singular: 'Paid Subscription',
    plural: 'Paid Subscriptions',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Monetization',
    defaultColumns: ['name', 'price', 'interval', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'interval',
      type: 'select',
      required: true,
      options: ['month', 'year'],
    },
    {
      name: 'status',
      type: 'select',
      options: ['active', 'inactive'],
      defaultValue: 'active',
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}
