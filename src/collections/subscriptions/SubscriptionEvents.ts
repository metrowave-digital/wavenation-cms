import type { CollectionConfig } from 'payload'

export const SubscriptionEvents: CollectionConfig = {
  slug: 'subscription-events',

  labels: {
    singular: 'Subscription Event',
    plural: 'Subscription Events',
  },

  admin: {
    group: 'Monetization',
    useAsTitle: 'eventType',
    defaultColumns: ['eventType', 'customerId', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user?.role, // staff only
    create: ({ req }) => req.user?.role === 'admin',
    update: () => false, // immutable log
    delete: () => false,
  },

  fields: [
    {
      name: 'eventId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'eventType',
      type: 'text',
      required: true,
    },
    {
      name: 'customerId',
      type: 'text',
      required: true,
    },
    {
      name: 'payload',
      type: 'json',
      required: true,
    },
  ],
}

export default SubscriptionEvents
