// src/collections/ecommerce/Tickets.ts
import type { CollectionConfig } from 'payload'
import QRCode from 'qrcode'

export const Tickets: CollectionConfig = {
  slug: 'tickets',

  admin: {
    useAsTitle: 'ticketCode',
    group: 'E-Commerce',
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: () => false,
    delete: () => false,
  },

  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.ticketCode = data.ticketCode || `WN-${Math.random().toString(36).substring(2, 10)}`
        data.qrCodeImage = await QRCode.toDataURL(data.ticketCode)
        return data
      },
    ],
  },

  fields: [
    { name: 'ticketCode', type: 'text', unique: true },
    { name: 'qrCodeImage', type: 'text' },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'valid',
      options: [
        { label: 'Valid', value: 'valid' },
        { label: 'Used', value: 'used' },
        { label: 'Revoked', value: 'revoked' },
      ],
    },
  ],
}
