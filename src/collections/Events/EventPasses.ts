import type { CollectionConfig } from 'payload'

export const EventPasses: CollectionConfig = {
  slug: 'event-passes',

  admin: {
    useAsTitle: 'passCode',
    group: 'Events',
    defaultColumns: ['passCode', 'passType', 'owner', 'status'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ---------------- PASS IDENTIFICATION ---------------- */
    {
      name: 'passCode',
      type: 'text',
      unique: true,
      index: true,
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Used / Scanned', value: 'used' },
        { label: 'Transferred', value: 'transferred' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    /* ---------------- PASS OWNER ---------------- */
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { description: 'Optional different attendee.' },
    },

    /* ---------------- PASS TYPE ---------------- */
    {
      name: 'passType',
      type: 'select',
      required: true,
      options: [
        { label: 'Festival Pass', value: 'festival' },
        { label: 'Weekend Pass', value: 'weekend' },
        { label: 'VIP Pass', value: 'vip' },
        { label: 'Platinum Pass', value: 'platinum' },
        { label: 'Industry Badge', value: 'industry' },
        { label: 'Creator Badge', value: 'creator' },
        { label: 'Staff', value: 'staff' },
      ],
    },

    /* ---------------- EVENTS COVERED ---------------- */
    {
      name: 'validEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'All events this pass grants access to.',
      },
    },

    {
      name: 'expirationDate',
      type: 'date',
    },

    /* ---------------- SCAN HISTORY ---------------- */
    {
      name: 'checkins',
      type: 'relationship',
      relationTo: 'event-checkins',
      hasMany: true,
      admin: { readOnly: true },
    },

    /* ---------------- METADATA ---------------- */
    { name: 'metadata', type: 'json' },

    /* ---------------- AUDIT ---------------- */
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
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) data.createdBy = req.user.id
        if (req.user) data.updatedBy = req.user.id
        return data
      },
    ],
  },
}
