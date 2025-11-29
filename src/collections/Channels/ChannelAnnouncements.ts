import type { CollectionConfig } from 'payload'

export const ChannelAnnouncements: CollectionConfig = {
  slug: 'channel-announcements',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
  },

  fields: [
    { name: 'channel', type: 'relationship', relationTo: 'creator-channels', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText', required: true },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: ['public', 'subscribers', 'tiers'],
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: { condition: (d) => d?.visibility === 'tiers' },
    },

    { name: 'pinned', type: 'checkbox', defaultValue: true },
    { name: 'expiresAt', type: 'date' },
  ],
}
