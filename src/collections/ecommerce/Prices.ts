// src/collections/ecommerce/Prices.ts
import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const Prices: CollectionConfig = {
  slug: 'prices',

  admin: {
    useAsTitle: 'label',
    group: 'E-Commerce',
    defaultColumns: ['label', 'currency', 'amount', 'stripePriceId'],
  },

  access: {
    read: () => true,
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  fields: [
    { name: 'label', type: 'text', required: true },

    { name: 'currency', type: 'text', defaultValue: 'usd' },

    { name: 'amount', type: 'number', required: true },

    {
      name: 'interval',
      type: 'select',
      options: [
        { label: 'One-Time', value: 'one_time' },
        { label: 'Monthly', value: 'month' },
        { label: 'Yearly', value: 'year' },
      ],
      defaultValue: 'one_time',
    },

    { name: 'stripePriceId', type: 'text', required: true },
  ],
}
