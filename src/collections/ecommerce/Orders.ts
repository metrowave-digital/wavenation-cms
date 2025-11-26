// src/collections/ecommerce/Orders.ts
import type { CollectionConfig } from 'payload'
import { publicRead } from '@/access/control'

export const Orders: CollectionConfig = {
  slug: 'orders',

  admin: {
    useAsTitle: 'id',
    group: 'E-Commerce',
  },

  access: {
    read: ({ req }) => !!req.user && req.user.role === 'admin',
    create: () => true,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'relationship',
          relationTo: 'prices',
        },
        { name: 'quantity', type: 'number', defaultValue: 1 },
      ],
    },

    { name: 'stripeCustomerId', type: 'text' },
    { name: 'stripePaymentIntentId', type: 'text' },

    { name: 'total', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'usd' },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}

export default Orders
