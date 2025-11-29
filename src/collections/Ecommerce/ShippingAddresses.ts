import type { CollectionConfig } from 'payload'

export const ShippingAddresses: CollectionConfig = {
  slug: 'shipping-addresses',

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
    { name: 'user', type: 'relationship', relationTo: 'profiles' },
    { name: 'fullName', type: 'text', required: true },
    { name: 'line1', type: 'text', required: true },
    { name: 'line2', type: 'text' },
    { name: 'city', type: 'text', required: true },
    { name: 'state', type: 'text' },
    { name: 'postalCode', type: 'text' },
    { name: 'country', type: 'text', required: true },
    { name: 'phone', type: 'text' },
  ],
}
