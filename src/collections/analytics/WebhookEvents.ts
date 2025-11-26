import type { CollectionConfig } from 'payload'

export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  admin: {
    useAsTitle: 'id',
    group: 'System',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'eventId', type: 'text', unique: true },
    { name: 'provider', type: 'text' },
    { name: 'eventType', type: 'text' },

    { name: 'payload', type: 'json' },
    { name: 'processed', type: 'checkbox', defaultValue: false },

    { name: 'createdAt', type: 'date', defaultValue: () => new Date().toISOString() },
  ],
}

export default WebhookEvents
