import type { CollectionConfig } from 'payload'

export const CreatorEarnings: CollectionConfig = {
  slug: 'creator-earnings',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Economy',
    defaultColumns: ['creator', 'month', 'gross', 'payoutStatus'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('system') || req.user?.roles?.includes('admin')),
    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    delete: () => false,
  },

  fields: [
    { name: 'creator', type: 'relationship', relationTo: 'profiles', required: true },

    {
      type: 'row',
      fields: [
        { name: 'month', type: 'text', admin: { width: '50%', description: 'Format: 2025-03' } },
        { name: 'currency', type: 'text', defaultValue: 'USD', admin: { width: '50%' } },
      ],
    },

    /* Revenue */
    { name: 'gross', type: 'number', defaultValue: 0 },
    { name: 'platformFee', type: 'number', defaultValue: 0 },
    { name: 'processingFee', type: 'number', defaultValue: 0 },
    { name: 'net', type: 'number', defaultValue: 0 },

    /* Payout State */
    {
      name: 'payoutStatus',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'paid', 'held'].map((v) => ({ label: v, value: v })),
    },

    { name: 'payout', type: 'relationship', relationTo: 'creator-payouts' },

    { name: 'metadata', type: 'json' },
  ],
}
