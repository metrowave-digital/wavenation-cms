import type { CollectionConfig } from 'payload'

export const EventAnalytics: CollectionConfig = {
  slug: 'event-analytics',

  admin: {
    useAsTitle: 'id',
    group: 'Events',
    defaultColumns: ['event', 'date', 'channel'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('system')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('system')),
    delete: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('system')),
  },

  timestamps: true,

  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Aggregation date (typically daily).',
      },
    },

    {
      name: 'channel',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'On-site (Box Office)', value: 'onsite' },
        { label: 'Partner / Affiliate', value: 'partner' },
      ],
    },

    /* ---------------- FUNNEL + SALES ---------------- */
    {
      name: 'funnel',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'pageViews', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'detailViews', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'checkoutStarts', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'checkoutAbandons', type: 'number', defaultValue: 0, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'orders', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'ticketsSold', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'grossRevenue', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'refunds', type: 'number', defaultValue: 0, admin: { width: '25%' } },
          ],
        },
      ],
    },

    /* ---------------- ATTENDANCE ---------------- */
    {
      name: 'attendance',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'checkins', type: 'number', defaultValue: 0, admin: { width: '33%' } },
            { name: 'uniqueAttendees', type: 'number', defaultValue: 0, admin: { width: '33%' } },
            { name: 'noShows', type: 'number', defaultValue: 0, admin: { width: '33%' } },
          ],
        },
      ],
    },

    {
      name: 'extra',
      type: 'json',
      admin: {
        description: 'Custom analytic dimensions (e.g., by ticket type, promo code).',
      },
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'ingestedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'System or admin that inserted this record.',
        readOnly: true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user && operation === 'create') {
          data.ingestedBy = req.user.id
        }
        return data
      },
    ],
  },
}
