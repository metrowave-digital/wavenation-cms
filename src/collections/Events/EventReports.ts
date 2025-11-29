import type { CollectionConfig } from 'payload'

export const EventReports: CollectionConfig = {
  slug: 'event-reports',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'scope', 'rangeType', 'generatedAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('super-admin')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('super-admin')),
    delete: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('super-admin')),
  },

  timestamps: true,

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated if empty.',
      },
    },

    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'event',
      options: [
        { label: 'Single Event', value: 'event' },
        { label: 'Multiple Events', value: 'multi-event' },
        { label: 'Date Range (All Events)', value: 'date-range' },
      ],
    },

    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Events included in this report.',
      },
    },

    {
      name: 'rangeType',
      type: 'select',
      defaultValue: 'custom',
      options: [
        { label: 'Custom', value: 'custom' },
        { label: 'Event Lifetime', value: 'lifetime' },
        { label: 'Pre-Event Only', value: 'pre-event' },
        { label: 'At-Event (Day Of)', value: 'day-of' },
        { label: 'Post-Event Only', value: 'post-event' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'dateFrom',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'dateTo',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'generatedAt',
      type: 'date',
    },

    /* ---------------- METRICS SNAPSHOT ---------------- */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'ticketsSold', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'ticketsScanned', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'uniqueAttendees', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            {
              name: 'noShowRate',
              type: 'number',
              admin: { width: '25%', description: '0–1 fraction' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'grossRevenue', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'feesCollected', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'refunds', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'netRevenue', type: 'number', defaultValue: 0, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'pageViews', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'checkoutStarts', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            {
              name: 'checkoutCompletions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'conversionRate',
              type: 'number',
              admin: { width: '25%', description: '0–1 fraction' },
            },
          ],
        },
      ],
    },

    {
      name: 'breakdowns',
      type: 'json',
      admin: {
        description: 'Optional structured breakdowns (e.g., by ticket type, channel, day).',
      },
    },

    {
      name: 'notes',
      type: 'textarea',
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'generatedBy',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Profile who triggered this report generation.',
      },
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
        if (!data.generatedAt) {
          data.generatedAt = new Date()
        }

        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        return data
      },
    ],
  },
}
