import type { CollectionConfig } from 'payload'

export const EcommerceOrders: CollectionConfig = {
  slug: 'ecommerce-orders',

  admin: {
    useAsTitle: 'orderNumber',
    group: 'Ecommerce',
    defaultColumns: ['orderNumber', 'status', 'total', 'customer'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => true,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    { name: 'orderNumber', type: 'text', unique: true },
    { name: 'customer', type: 'relationship', relationTo: 'profiles' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variant', type: 'relationship', relationTo: 'product-variants' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'total', type: 'number' },
      ],
    },

    { name: 'subtotal', type: 'number' },
    { name: 'shipping', type: 'number' },
    { name: 'tax', type: 'number' },
    { name: 'discount', type: 'number' },
    { name: 'total', type: 'number' },

    { name: 'shippingAddress', type: 'relationship', relationTo: 'shipping-addresses' },
    { name: 'paymentRecord', type: 'relationship', relationTo: 'payment-records' },
  ],
}
