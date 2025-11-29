import type { CollectionConfig } from 'payload'

export const PaymentRecords: CollectionConfig = {
  slug: 'payment-records',

  admin: {
    useAsTitle: 'id',
    group: 'Ecommerce',
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => true,
  },

  fields: [
    {
      name: 'provider',
      type: 'select',
      options: ['stripe', 'paypal', 'cashapp', 'manual'].map((v) => ({ label: v, value: v })),
    },
    { name: 'providerId', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'amount', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'raw', type: 'json' },
  ],
}
