import type { CollectionConfig } from 'payload'

export const CreatorPayouts: CollectionConfig = {
  slug: 'creator-payouts',

  admin: {
    useAsTitle: 'payoutReference',
    group: 'Creator Economy',
    defaultColumns: ['creator', 'amount', 'status', 'payoutDate'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    delete: () => false,
  },

  fields: [
    { name: 'creator', type: 'relationship', relationTo: 'profiles', required: true },

    { name: 'payoutReference', type: 'text', unique: true },

    {
      type: 'row',
      fields: [
        { name: 'amount', type: 'number', admin: { width: '50%' } },
        { name: 'currency', type: 'text', defaultValue: 'USD', admin: { width: '50%' } },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'processing',
      options: ['processing', 'paid', 'failed', 'reversed'].map((v) => ({ label: v, value: v })),
    },

    { name: 'payoutDate', type: 'date' },
    { name: 'notes', type: 'textarea' },
    { name: 'metadata', type: 'json' },
  ],
}
