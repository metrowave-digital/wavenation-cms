import type { CollectionConfig } from 'payload'

export const LiveChannels: CollectionConfig = {
  slug: 'live-channels',

  admin: {
    group: 'Live TV',
    useAsTitle: 'name',
    defaultColumns: ['name', 'streamUrl', 'isActive'],
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'name', type: 'text', required: true },

    {
      name: 'streamUrl',
      type: 'text',
      required: true,
      admin: { description: 'Cloudflare Stream, Livepeer, Fastly, etc.' },
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'epgChannelId',
      type: 'text',
      admin: { description: 'External EPG ID if needed' },
    },
  ],
}

export default LiveChannels
