import type { CollectionConfig } from 'payload'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',

  admin: {
    useAsTitle: 'sku',
    group: 'Ecommerce',
    defaultColumns: ['sku', 'price', 'inventory'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'sku', type: 'text', unique: true, required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },

    {
      name: 'options',
      type: 'array',
      fields: [
        { name: 'key', type: 'text' }, // size, color, etc.
        { name: 'value', type: 'text' },
      ],
    },

    {
      name: 'inventory',
      type: 'number',
      required: true,
      admin: { description: 'Inventory for this specific variant' },
    },
  ],
}
