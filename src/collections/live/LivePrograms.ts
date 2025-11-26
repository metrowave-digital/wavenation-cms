import type { CollectionConfig } from 'payload'

export const LivePrograms: CollectionConfig = {
  slug: 'live-programs',

  admin: {
    group: 'Live TV',
    useAsTitle: 'title',
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
      name: 'description',
      type: 'textarea',
    },
  ],
}

export default LivePrograms
