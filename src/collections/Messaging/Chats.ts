import type { CollectionConfig, Access, FieldAccess } from 'payload'
import { isStaffAccess, isModeratorOrAboveField } from '@/access/control'

/* ============================================================
   COLLECTION ACCESS (COARSE — SAFE)
============================================================ */

const canReadChats: Access = ({ req }) => Boolean(req?.user)
const canCreateChats: Access = ({ req }) => Boolean(req?.user)
const canUpdateChats: Access = ({ req }) => Boolean(req?.user && isStaffAccess({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const Chats: CollectionConfig = {
  slug: 'chats',

  admin: {
    useAsTitle: 'title',
    group: 'Communications',
    defaultColumns: ['title', 'chatType', 'isGroup', 'lastActivity'],
  },

  access: {
    read: canReadChats,
    create: canCreateChats,
    update: canUpdateChats,
    delete: ({ req }) => Boolean(req?.user?.roles?.includes('admin')),
  },

  timestamps: true,

  /* ============================================================
     HOOKS — MEMBERSHIP & LOCK ENFORCEMENT
  ============================================================ */
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        if (!req?.user) return data

        // Auto timestamps
        data.lastActivity = new Date()

        // Auto-title for DMs
        if (!data.title && data.chatType === 'dm') {
          data.title = 'Direct Message'
        }

        // Audit
        if (operation === 'create') data.createdBy = req.user.id
        data.updatedBy = req.user.id

        // Prevent updates to locked chats (except staff)
        if (operation === 'update' && originalDoc?.isLocked && !isStaffAccess({ req })) {
          throw new Error('This chat is locked.')
        }

        // Enforce allowedRoles on create
        if (
          operation === 'create' &&
          Array.isArray(data.allowedRoles) &&
          data.allowedRoles.length > 0
        ) {
          const userRoles = Array.isArray(req.user.roles) ? req.user.roles : []

          const allowed = data.allowedRoles.some((r) => userRoles.includes(r))

          if (!allowed) {
            throw new Error('You do not have permission to create this chat.')
          }
        }

        return data
      },
    ],
  },

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
     * SNAPSHOT
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
     * SETTINGS
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
        description: 'Prevent further messages.',
      },
      access: {
        update: isModeratorOrAboveField,
      },
    },

    {
      name: 'allowedRoles',
      type: 'select',
      hasMany: true,
      admin: {
        description: 'Restrict chat to specific roles (optional).',
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
     * PINNED
     --------------------------------------------------------- */
    {
      name: 'pinnedMessages',
      type: 'relationship',
      relationTo: 'messages',
      hasMany: true,
    },

    /* ---------------------------------------------------------
     * GROUP META
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
      access: { update: () => false },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { update: () => false },
    },
  ],
}
