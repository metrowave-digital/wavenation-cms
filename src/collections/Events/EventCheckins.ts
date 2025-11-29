import type { CollectionConfig } from 'payload'

export const EventCheckins: CollectionConfig = {
  slug: 'event-checkins',

  admin: {
    useAsTitle: 'id',
    group: 'Events',
    defaultColumns: ['ticket', 'event', 'method', 'checkedInAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user), // scanning app or staff
    update: () => false,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ---------------- TICKET + EVENT ---------------- */
    {
      name: 'ticket',
      type: 'relationship',
      relationTo: 'tickets',
      required: true,
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
      admin: { readOnly: true },
    },

    /* ---------------- CHECK-IN DETAILS ---------------- */
    {
      name: 'checkedInAt',
      type: 'date',
      required: true,
    },

    {
      name: 'method',
      type: 'select',
      required: true,
      options: [
        { label: 'QR Scan', value: 'qr' },
        { label: 'Barcode Scan', value: 'barcode' },
        { label: 'Manual', value: 'manual' },
        { label: 'Kiosk', value: 'kiosk' },
        { label: 'RFID Wristband', value: 'rfid' },
      ],
    },

    {
      name: 'device',
      type: 'text',
      admin: {
        description: 'Device used for scan (scanner ID or kiosk ID).',
      },
    },

    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Staff or volunteer who performed the check-in.',
      },
    },

    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number', admin: { width: '50%' } },
        { name: 'longitude', type: 'number', admin: { width: '50%' } },
      ],
    },

    {
      name: 'valid',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Marked false if duplicate scan or invalid ticket.',
      },
    },

    {
      name: 'notes',
      type: 'textarea',
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}
