import type { CollectionConfig } from 'payload'

export const EPGEvents: CollectionConfig = {
  slug: 'epg-events',

  admin: {
    group: 'Live TV',
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'startTime', 'endTime'],
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'live-channels',
      required: true,
    },

    {
      name: 'startTime',
      type: 'date',
      required: true,
    },

    {
      name: 'endTime',
      type: 'date',
      required: true,
    },

    { name: 'description', type: 'textarea' },
  ],
}

export default EPGEvents
