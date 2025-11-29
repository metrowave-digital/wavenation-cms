import type { CollectionConfig } from 'payload'

export const Alerts: CollectionConfig = {
  slug: 'alerts',

  admin: {
    group: 'Engagement',
    useAsTitle: 'title',
    defaultColumns: ['title', 'severity', 'active', 'startsAt', 'endsAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user?.roles?.includes('admin'),
    update: ({ req }) => !!req.user?.roles?.includes('admin'),
    delete: ({ req }) => !!req.user?.roles?.includes('admin'),
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    { name: 'message', type: 'textarea', required: true },

    {
      name: 'severity',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
      ],
    },

    { name: 'active', type: 'checkbox', defaultValue: true },

    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', admin: { width: '50%' } },
        { name: 'endsAt', type: 'date', admin: { width: '50%' } },
      ],
    },

    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export default Alerts
