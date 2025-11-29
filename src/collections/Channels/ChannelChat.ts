// src/collections/ChannelChat.ts
import type { CollectionConfig } from 'payload'

export const ChannelChat: CollectionConfig = {
  slug: 'channel-chat',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Channels',
    defaultColumns: ['channel', 'livestream', 'user', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user), // you can tighten later
    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('moderator')),
  },

  timestamps: true,

  fields: [
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
    },
    {
      name: 'livestream',
      type: 'relationship',
      relationTo: 'channel-livestreams',
      required: true,
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'message',
      type: 'text',
      required: true,
    },

    /* THREADING / REPLIES INSIDE CHAT */
    {
      name: 'replyTo',
      type: 'relationship',
      relationTo: 'channel-chat',
      admin: { description: 'Optional reply to another chat message' },
    },

    /* REACTIONS */
    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'reactions',
      hasMany: true,
      admin: { description: 'Quick emoji reactions for this chat message.' },
    },

    /* MODERATION / SAFETY */
    {
      name: 'isDeleted',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'deletedReason',
      type: 'text',
    },
    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'toxicityScore',
      type: 'number',
      admin: { description: '0–1 from AI moderation.' },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
    },

    /* METADATA */
    {
      name: 'source',
      type: 'select',
      defaultValue: 'web',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'TV', value: 'tv' },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
