import type { CollectionConfig, Access } from 'payload'

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const TicketTransfer: CollectionConfig = {
  slug: 'ticket-transfers',
  admin: {
    useAsTitle: 'transferCode',
    group: 'Events',
    defaultColumns: ['event', 'fromUser', 'toUser', 'status'],
  },

  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: ({ req }) => {
      const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
      return roles.includes('admin')
    },
  },

  timestamps: true,

  fields: [
    {
      name: 'transferCode',
      type: 'text',
      unique: true,
      required: true,
      admin: { readOnly: true },
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    {
      name: 'ticketType',
      type: 'relationship',
      relationTo: 'ticket-types',
      required: true,
    },

    {
      name: 'fromUser',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'toUser',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },

    {
      name: 'reason',
      type: 'textarea',
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // auto-gen transfer code
        if (operation === 'create' && !data.transferCode) {
          data.transferCode = 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        }

        return data
      },
    ],
  },
}
