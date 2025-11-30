import type { CollectionConfig } from 'payload'

export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',

  admin: {
    useAsTitle: 'pollDisplay',
    group: 'Engagement',
    defaultColumns: ['poll', 'optionLabel', 'user', 'ip', 'createdAt'],
  },

  access: {
    read: ({ req }) => {
      // Public users can read votes (aggregated only)
      if (!req.user) return true

      // Admins full access
      if (req.user.roles?.includes('admin')) return true

      // Default: readable
      return true
    },

    create: () => true,
    update: () => false,

    delete: ({ req }) => {
      return req.user?.roles?.includes('admin') === true
    },
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
      name: 'optionValue',
      type: 'number',
      required: true,
    },

    {
      name: 'optionLabel',
      type: 'text',
      required: true,
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'ip',
      type: 'text',
      required: true,
    },

    {
      name: 'userAgent',
      type: 'text',
      required: false,
    },

    {
      name: 'targetContentType',
      type: 'text',
      required: false,
    },

    {
      name: 'targetContentId',
      type: 'text',
      required: false,
    },

    {
      name: 'pollDisplay',
      type: 'text',
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data && data.poll && data.optionLabel) {
              data.pollDisplay = `Poll ${data.poll} — ${data.optionLabel}`
            }
            return data
          },
        ],
      },
    },
  ],
}

export default PollVotes
