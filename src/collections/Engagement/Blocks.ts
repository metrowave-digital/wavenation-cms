import type { CollectionConfig } from 'payload'

export const Blocks: CollectionConfig = {
  slug: 'blocks',

  admin: {
    useAsTitle: 'id',
    group: 'Safety',
    defaultColumns: ['blocker', 'blocked', 'reason', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => false,
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    {
      name: 'blocker',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'blocked',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Harassment', value: 'harassment' },
        { label: 'Spam', value: 'spam' },
        { label: 'Scam/Phishing', value: 'scam' },
        { label: 'Abusive Language', value: 'abuse' },
        { label: 'Impersonation', value: 'impersonation' },
        { label: 'Inappropriate Content', value: 'inappropriate' },
        { label: 'Violation of Terms', value: 'terms' },
        { label: 'Personal Safety', value: 'safety' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Optional moderator notes.' },
    },

    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional. Automatically expires the block.',
      },
    },

    // AI moderation extension
    {
      name: 'aiEvidence',
      type: 'json',
      admin: {
        description: 'Optional AI content analysis that led to block.',
      },
    },

    // Audit
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}
