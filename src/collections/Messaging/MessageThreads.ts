import type { CollectionConfig, Access, FieldAccess } from 'payload'
import { isLoggedIn, isStaffAccess, isModeratorOrAboveField } from '@/access/control'

/* ============================================================
   COLLECTION ACCESS (COARSE — NO doc HERE)
============================================================ */

const canReadThreads: Access = ({ req }) => Boolean(req?.user)
const canCreateThreads: Access = isLoggedIn
const canUpdateThreads: Access = ({ req }) => Boolean(req?.user && isStaffAccess({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const MessageThreads: CollectionConfig = {
  slug: 'message-threads',

  admin: {
    useAsTitle: 'id',
    group: 'Communications',
    defaultColumns: ['rootMessage', 'chat', 'lastActivity'],
  },

  access: {
    read: canReadThreads,
    create: canCreateThreads,
    update: canUpdateThreads,
    delete: ({ req }) => Boolean(req?.user?.roles?.includes('admin')),
  },

  timestamps: true,

  /* ============================================================
     HOOKS — THREAD RULE ENFORCEMENT
  ============================================================ */
  hooks: {
    beforeChange: [
      async ({ req, data, originalDoc, operation }) => {
        if (!req?.user) return data

        // Audit
        if (operation === 'create') data.createdBy = req.user.id
        data.updatedBy = req.user.id

        // Auto last activity
        data.lastActivity = new Date()

        // Prevent updates to locked threads (except staff)
        if (operation === 'update' && originalDoc?.isLocked && !isStaffAccess({ req })) {
          throw new Error('This thread is locked.')
        }

        return data
      },
    ],
  },

  fields: [
    /* ---------------------------------------------------------
     * CORE RELATIONS
     --------------------------------------------------------- */
    {
      name: 'rootMessage',
      type: 'relationship',
      relationTo: 'messages',
      required: true,
      access: { update: () => false },
    },

    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
      access: { update: () => false },
    },

    /* ---------------------------------------------------------
     * THREAD CONTENT
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
     * METADATA
     --------------------------------------------------------- */
    {
      name: 'lastActivity',
      type: 'date',
    },

    {
      name: 'isLocked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Prevent further replies in this thread.',
      },
      access: {
        update: isModeratorOrAboveField,
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
