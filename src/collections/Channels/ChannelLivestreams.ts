import type { CollectionConfig } from 'payload'

export const ChannelLivestreams: CollectionConfig = {
  slug: 'channel-livestreams',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
  },

  fields: [
    { name: 'channel', type: 'relationship', relationTo: 'creator-channels', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },

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

    { name: 'scheduledStart', type: 'date' },
    { name: 'scheduledEnd', type: 'date' },

    {
      name: 'streamState',
      type: 'select',
      defaultValue: 'scheduled',
      options: ['scheduled', 'live', 'ended', 'canceled'],
    },

    { name: 'streamUrl', type: 'text' },
    { name: 'dvrPlaybackUrl', type: 'text' },
    { name: 'chatEnabled', type: 'checkbox', defaultValue: true },

    {
      name: 'liveChatArchive',
      type: 'relationship',
      relationTo: 'chat-media',
      hasMany: true,
    },
  ],
}
