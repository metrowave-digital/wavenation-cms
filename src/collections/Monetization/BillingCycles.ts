import type { CollectionConfig } from 'payload'

export const BillingCycles: CollectionConfig = {
  slug: 'billing-cycles',

  admin: {
    group: 'Subscriptions',
    useAsTitle: 'id',
  },

  fields: [
    { name: 'subscription', type: 'relationship', relationTo: 'subscriptions', required: true },
    { name: 'cycleStart', type: 'date', required: true },
    { name: 'cycleEnd', type: 'date', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: ['upcoming', 'active', 'completed'].map((v) => ({ label: v, value: v })),
    },
    { name: 'amount', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'paidAt', type: 'date' },
  ],
}
