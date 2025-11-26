// src/collections/ecommerce/Entitlements.ts
import type { CollectionConfig } from 'payload'

export const Entitlements: CollectionConfig = {
  slug: 'entitlements',

  admin: { group: 'E-Commerce' },

  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'label', type: 'text' },

    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Digital Download', value: 'digital' },
        { label: 'Subscription Access', value: 'subscription' },
        { label: 'Live Video', value: 'live-video' },
        { label: 'Event Ticket', value: 'ticket' },
        { label: 'Premium Content', value: 'premium' },
      ],
    },

    {
      name: 'resourceId',
      type: 'text',
      admin: { description: 'ID of the protected resource (video, file, etc.)' },
    },
  ],
}
