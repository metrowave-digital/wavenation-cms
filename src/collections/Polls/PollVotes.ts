// src/collections/PollVotes.ts
import type { CollectionConfig } from 'payload'

export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['poll', 'voter', 'optionValue', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
    },

    // Also used for ChannelPolls
    {
      name: 'channelPoll',
      type: 'relationship',
      relationTo: 'channel-polls',
      admin: {
        description: 'Used when vote belongs to a channel-level poll.',
      },
    },

    {
      name: 'voter',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { description: 'May be null if allowMultipleVotes & anonymous' },
    },

    {
      name: 'ipHash',
      type: 'text',
      admin: { description: 'Hashed IP (for rate limiting / fraud)' },
    },

    {
      name: 'optionValue',
      type: 'text',
      required: true,
      admin: { description: 'Must match an option.value from the poll' },
    },

    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
