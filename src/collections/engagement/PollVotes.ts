import type { CollectionConfig } from 'payload'
import { isAdmin, allowRoles, publicRead } from '@/access/control'
import { onCreateVote } from '@/hooks/pollVotes/onCreateVote'

export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',
  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['poll', 'user', 'optionIndex', 'riskScore', 'blocked', 'createdAt'],
  },

  access: {
    read: isAdmin,
    create: publicRead,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false, // allow anonymous voters
    },
    {
      name: 'optionIndex',
      type: 'number',
      required: true,
    },

    // OPTIONAL raw IP / UA (admin debug only)
    {
      name: 'ip',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { readOnly: true },
    },

    // Hashed identifiers for fraud checks
    {
      name: 'ipHash',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'fingerprint',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'fingerprintHash',
      type: 'text',
      admin: { readOnly: true },
    },

    // Simple risk flags
    {
      name: 'riskScore',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'blocked',
      type: 'checkbox',
      defaultValue: false,
    },
  ],

  hooks: {
    afterChange: [onCreateVote],
  },
}

export default PollVotes
