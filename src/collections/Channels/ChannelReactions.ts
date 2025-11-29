import type { CollectionConfig } from 'payload'

export const ChannelReactions: CollectionConfig = {
  slug: 'channel-reactions',

  admin: { group: 'Creator Channels' },

  fields: [
    { name: 'post', type: 'relationship', relationTo: 'channel-posts' },
    { name: 'comment', type: 'relationship', relationTo: 'channel-comments' },
    { name: 'user', type: 'relationship', relationTo: 'profiles', required: true },
    {
      name: 'reaction',
      type: 'select',
      required: true,
      options: ['👍', '🔥', '💯', '😂', '😍', '😢'].map((v) => ({ label: v, value: v })),
    },
  ],
}
