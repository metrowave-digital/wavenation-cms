import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: { group: 'Ecommerce', useAsTitle: 'id' },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    { name: 'user', type: 'relationship', relationTo: 'profiles' },

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
          name: 'variant',
          type: 'relationship',
          relationTo: 'product-variants',
        },
        { name: 'quantity', type: 'number', required: true, defaultValue: 1 },
      ],
    },

    { name: 'subtotal', type: 'number' },
    { name: 'discounts', type: 'number' },
    { name: 'total', type: 'number' },
  ],
}
