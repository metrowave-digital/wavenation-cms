import type { CollectionConfig } from 'payload'

export const Chats: CollectionConfig = {
  slug: 'chats',

  admin: {
    useAsTitle: 'title',
    group: 'Communications',
    defaultColumns: ['title', 'chatType', 'isGroup', 'lastActivity'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------
     * IDENTIFICATION
     --------------------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Chat title (auto-filled for DMs; editable for group chats).',
      },
    },

    {
      name: 'chatType',
      type: 'select',
      defaultValue: 'dm',
      required: true,
      options: [
        { label: 'Direct Message', value: 'dm' },
        { label: 'Group Chat', value: 'group' },
        { label: 'Creator Chat', value: 'creator' },
        { label: 'Team Chat', value: 'team' },
        { label: 'Support', value: 'support' },
      ],
    },

    {
      name: 'isGroup',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ---------------------------------------------------------
     * MEMBERSHIP
     --------------------------------------------------------- */
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      required: true,
    },

    /* ---------------------------------------------------------
     * LAST MESSAGE SNAPSHOT
     --------------------------------------------------------- */
    {
      name: 'lastMessage',
      type: 'relationship',
      relationTo: 'messages',
    },

    {
      name: 'lastActivity',
      type: 'date',
    },

    /* ---------------------------------------------------------
     * CHAT SETTINGS
     --------------------------------------------------------- */
    {
      name: 'mutedBy',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    {
      name: 'isLocked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Admins can lock chat from further messages.',
      },
    },

    {
      name: 'allowedRoles',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'Restrict chat to specific roles (optional)',
      },
      options: [
        { label: 'Creator', value: 'creator' },
        { label: 'Pro Creator', value: 'pro' },
        { label: 'Industry', value: 'industry' },
        { label: 'Host', value: 'host' },
        { label: 'Editor', value: 'editor' },
        { label: 'DJ', value: 'dj' },
        { label: 'Admin', value: 'admin' },
      ],
    },

    /* ---------------------------------------------------------
     * PINNED MESSAGES
     --------------------------------------------------------- */
    {
      name: 'pinnedMessages',
      type: 'relationship',
      relationTo: 'messages',
      hasMany: true,
    },

    /* ---------------------------------------------------------
     * CHAT REACTIONS (optional: like group reactions)
     --------------------------------------------------------- */
    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'reactions',
      hasMany: true,
    },

    /* ---------------------------------------------------------
     * CHAT DESCRIPTION & BANNER (group chats only)
     --------------------------------------------------------- */
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (data) => data?.chatType !== 'dm',
      },
    },

    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.chatType !== 'dm',
      },
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
      ({ data, req, operation }) => {
        // Auto-lastActivity
        data.lastActivity = new Date()

        // Auto-title for DMs
        if (!data.title && data.chatType === 'dm') {
          data.title = 'Direct Message'
        }

        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        return data
      },
    ],
  },
}
