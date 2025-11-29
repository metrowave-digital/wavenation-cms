import type { CollectionConfig } from 'payload'

export const TicketTypes: CollectionConfig = {
  slug: 'ticket-types',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'event', 'price', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    { name: 'name', type: 'text', required: true },

    {
      name: 'code',
      type: 'text',
      admin: { description: 'Internal code (e.g. GA, VIP, EBIRD).' },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Sold Out', value: 'sold-out' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: { width: '40%' },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          admin: { width: '30%' },
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
        },
        {
          name: 'feePolicy',
          type: 'select',
          defaultValue: 'include',
          options: [
            { label: 'Fees Included', value: 'include' },
            { label: 'Fees Added', value: 'add' },
          ],
          admin: { width: '30%' },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'quantityTotal',
          type: 'number',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'quantitySold',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', readOnly: true },
        },
        {
          name: 'quantityAvailable',
          type: 'number',
          admin: { width: '33%', readOnly: true },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'salesStart',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'salesEnd',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'minPerOrder',
          type: 'number',
          admin: { width: '50%' },
        },
        {
          name: 'maxPerOrder',
          type: 'number',
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (typeof data.quantityTotal === 'number' && typeof data.quantitySold === 'number') {
          data.quantityAvailable = Math.max(data.quantityTotal - data.quantitySold, 0)
        }

        return data
      },
    ],
  },
}
