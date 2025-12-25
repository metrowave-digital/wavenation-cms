import type { CollectionConfig, Access, FieldAccess } from 'payload'

import { isLoggedIn, isStaffAccess, isModeratorOrAboveField } from '@/access/control'

/* ============================================================
   COLLECTION ACCESS (COARSE-GRAINED)
============================================================ */

const canReadMessages: Access = ({ req }) => Boolean(req?.user)

const canCreateMessages: Access = isLoggedIn

// Only staff can bypass ownership — ownership enforced in hook
const canUpdateMessages: Access = ({ req }) => Boolean(req?.user && isStaffAccess({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const Messages: CollectionConfig = {
  slug: 'messages',

  admin: {
    useAsTitle: 'id',
    group: 'Communications',
    defaultColumns: ['sender', 'chat', 'status', 'createdAt'],
  },

  access: {
    read: canReadMessages,
    create: canCreateMessages,
    update: canUpdateMessages,
    delete: () => false, // immutable audit trail
  },

  /* ============================================================
     HOOKS — DOC-LEVEL OWNERSHIP (CORRECT PLACE)
  ============================================================ */
  hooks: {
    beforeChange: [
      async ({ req, data, originalDoc, operation }) => {
        if (!req?.user) return data

        // Staff override
        if (isStaffAccess({ req })) return data

        // Sender-only updates
        if (operation === 'update' && originalDoc) {
          const senderId =
            typeof originalDoc.sender === 'object' ? originalDoc.sender.id : originalDoc.sender

          if (String(senderId) !== String(req.user.id)) {
            throw new Error('You may only edit your own messages.')
          }
        }

        return data
      },
    ],
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------
     * RELATIONSHIPS
     --------------------------------------------------------- */
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'profiles',
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

    {
      name: 'replyTo',
      type: 'relationship',
      relationTo: 'messages',
    },

    /* ---------------------------------------------------------
     * CONTENT
     --------------------------------------------------------- */
    { name: 'text', type: 'textarea' },

    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },

    /* ---------------------------------------------------------
     * DELIVERY STATUS
     --------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'sent',
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Read', value: 'read' },
        { label: 'Failed', value: 'failed' },
      ],
      access: {
        update: isStaffAccess as FieldAccess,
      },
    },

    {
      name: 'readBy',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      access: { update: () => true },
    },

    /* ---------------------------------------------------------
     * MODERATION
     --------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      admin: { readOnly: true },
      access: { update: () => false },
    },

    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true },
      access: { update: () => false },
    },

    {
      name: 'isFlagged',
      type: 'checkbox',
      defaultValue: false,
      access: { update: isModeratorOrAboveField },
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
  ],
}
