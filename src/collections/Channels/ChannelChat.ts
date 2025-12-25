// src/collections/ChannelChat.ts
import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelChat: CollectionConfig = {
  slug: 'channel-chat',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Channels',
    defaultColumns: ['channel', 'livestream', 'user', 'createdAt', 'isDeleted'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: logged-in users only (tightenable later)
     - Create: logged-in users
     - Update: never (immutable)
     - Delete: soft-delete via moderation only
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isLoggedIn,

    create: AccessControl.isLoggedIn,

    update: () => false,

    delete: ({ req, data }) => {
      if (!req?.user) return false

      // Admin / staff override
      if (AccessControl.isAdminRole(req)) return true
      if (AccessControl.hasRoleAtOrAbove(req, 'staff' as any)) return true

      // Channel owner / moderator can moderate chat
      return AccessControl.canEditChannel(req, {
        creator: data?.channel,
      })
    },
  },

  timestamps: true,

  fields: [
    /* ================= CHANNEL / STREAM ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this chat message belongs to',
      },
    },
    {
      name: 'livestream',
      type: 'relationship',
      relationTo: 'channel-livestreams',
      required: true,
      admin: {
        description: 'Livestream this message was sent in',
      },
    },

    /* ================= AUTHOR ================= */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        description: 'User who sent the message',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= MESSAGE ================= */
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        description: 'Chat message (immutable)',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= THREADING ================= */
    {
      name: 'replyTo',
      type: 'relationship',
      relationTo: 'channel-chat',
      admin: {
        description: 'Optional reply to another chat message',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= REACTIONS ================= */
    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'channel-reactions',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Emoji reactions for this chat message',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= MODERATION (SOFT DELETE) ================= */
    {
      name: 'isDeleted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Soft-delete flag (message hidden but preserved)',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'deletedReason',
      type: 'text',
      admin: {
        description: 'Reason for moderation action',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Pinned messages appear at the top of chat',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= TOXICITY / SAFETY ================= */
    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Flagged by moderation system',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        description: '0–1 score from AI moderation',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= METADATA ================= */
    {
      name: 'source',
      type: 'select',
      defaultValue: 'web',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'TV', value: 'tv' },
      ],
      admin: {
        description: 'Client source',
      },
    },

    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Client or system metadata',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= AUDIT ================= */
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

  /* -----------------------------------------------------------
     HOOKS (ENTERPRISE SAFE)
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req?.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default ChannelChat
