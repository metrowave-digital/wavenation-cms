import type { CollectionConfig } from 'payload'

export const MessageThreads: CollectionConfig = {
  slug: 'message-threads',

  admin: {
    useAsTitle: 'id',
    group: 'Communications',
    defaultColumns: ['rootMessage', 'chat', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    update: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------
     * ROOT MESSAGE (The main message this thread belongs to)
     --------------------------------------------------------- */
    {
      name: 'rootMessage',
      type: 'relationship',
      relationTo: 'messages',
      required: true,
    },

    /* ---------------------------------------------------------
     * CHAT RELATION
     --------------------------------------------------------- */
    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
    },

    /* ---------------------------------------------------------
     * REPLIES IN THE THREAD
     --------------------------------------------------------- */
    {
      name: 'messages',
      type: 'relationship',
      relationTo: 'messages',
      hasMany: true,
      admin: {
        description: 'Messages inside this thread.',
      },
    },

    /* ---------------------------------------------------------
     * THREAD PARTICIPANTS
     --------------------------------------------------------- */
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: {
        description: 'Profiles who responded in this thread.',
      },
    },

    /* ---------------------------------------------------------
     * THREAD METADATA
     --------------------------------------------------------- */
    {
      name: 'lastActivity',
      type: 'date',
    },

    {
      name: 'isLocked',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Prevent further messages.' },
    },

    /* ---------------------------------------------------------
     * AUDIT
     --------------------------------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Audit
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }

        // Auto-update last activity
        data.lastActivity = new Date()

        return data
      },
    ],
  },
}
