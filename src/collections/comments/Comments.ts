import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { allowRoles } from '@/access/control'

// Auto-flag keywords
const SENSITIVE_KEYWORDS = ['hate', 'racist', 'kill', 'bomb', 'threat', 'suicide', 'self-harm']

// Hook: auto-flag based on keywords
const autoFlagComment: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.body) {
    const lower = data.body.toLowerCase()
    const flagged = SENSITIVE_KEYWORDS.some((kw) => lower.includes(kw))
    if (flagged) data.status = 'flagged'
  }
  return data
}

export const Comments: CollectionConfig = {
  slug: 'comments',

  labels: {
    singular: 'Comment',
    plural: 'Comments',
  },

  admin: {
    group: 'Engagement',
    useAsTitle: 'body',
    defaultColumns: ['body', 'status', 'target', 'user', 'createdAt'],
  },

  access: {
    read: () => true,
    create: () => true,
    update: allowRoles(['admin', 'editor']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  hooks: {
    beforeChange: [autoFlagComment],
  },

  fields: [
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Flagged', value: 'flagged' },
      ],
    },

    {
      name: 'moderationNotes',
      type: 'textarea',
      access: {
        read: ({ req }) => !!req.user && ['admin', 'editor'].includes(req.user.role),
        update: ({ req }) => !!req.user && ['admin', 'editor'].includes(req.user.role),
      },
      admin: {
        description: 'Private notes for moderators only.',
      },
    },

    {
      name: 'target',
      type: 'relationship',
      required: true,
      relationTo: ['episodes', 'films', 'articles', 'series', 'posts', 'polls'],
    },

    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'ipAddress',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
