import type { CollectionConfig } from 'payload'

export const EventPromotions: CollectionConfig = {
  slug: 'event-promotions',

  admin: {
    useAsTitle: 'code',
    group: 'Events',
    defaultColumns: ['code', 'discountType', 'value', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ---------------- CODE ---------------- */
    {
      name: 'code',
      type: 'text',
      unique: true,
      required: true,
      index: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },

    /* ---------------- DISCOUNT SETTINGS ---------------- */
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percent',
      options: [
        { label: 'Percentage (%)', value: 'percent' },
        { label: 'Fixed Amount ($)', value: 'amount' },
        { label: 'Free Ticket', value: 'free' },
      ],
    },

    {
      name: 'value',
      type: 'number',
      admin: { description: 'Apply % or $ discount based on type.' },
    },

    {
      name: 'appliesToEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },

    {
      name: 'appliesToTicketTypes',
      type: 'relationship',
      relationTo: 'ticket-types',
      hasMany: true,
    },

    {
      name: 'appliesToGroups',
      type: 'relationship',
      relationTo: 'groups',
      hasMany: true,
    },

    {
      name: 'affiliateCreator',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { description: 'Optional influencer/creator code.' },
    },

    /* ---------------- USAGE LIMITS ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'maxUses',
          type: 'number',
          admin: { width: '33%' },
        },
        {
          name: 'uses',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', readOnly: true },
        },
        {
          name: 'limitPerUser',
          type: 'number',
          admin: { width: '33%' },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', admin: { width: '50%' } },
        { name: 'endDate', type: 'date', admin: { width: '50%' } },
      ],
    },

    /* ---------------- VISIBILITY ---------------- */
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'If false, code is hidden unless entered manually.' },
    },

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

        // expiration autocheck
        if (data.endDate && new Date(data.endDate) < new Date()) {
          data.status = 'expired'
        }

        // usage limit autocheck
        if (data.maxUses && data.uses >= data.maxUses) {
          data.status = 'expired'
        }

        return data
      },
    ],
  },
}
