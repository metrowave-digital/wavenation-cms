import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelComments: CollectionConfig = {
  slug: 'channel-comments',

  admin: {
    group: 'Creator Channels',
    defaultColumns: ['body', 'user', 'post', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked
     - Create: logged-in users only
     - Update: never (immutable)
     - Delete:
         • comment author
         • channel moderator / owner
         • staff / admin
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: AccessControl.isLoggedIn,

    update: () => false,

    delete: ({ req, data }) => {
      if (!req?.user) return false

      // Admin / staff override
      if (AccessControl.isAdminRole(req)) return true
      if (AccessControl.hasRoleAtOrAbove(req, 'staff' as any)) return true

      // Comment author can delete their own comment
      const authorId =
        typeof data?.user === 'string'
          ? data.user
          : typeof data?.user === 'object'
            ? data.user?.id
            : null

      if (String(authorId) === String(req.user.id)) return true

      // Channel owner / moderator can moderate comments
      return AccessControl.canEditChannel(req, {
        creator: data?.post,
      })
    },
  },

  timestamps: true,

  fields: [
    /* ================= POST ================= */
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'channel-posts',
      required: true,
      admin: {
        description: 'Post this comment belongs to',
      },
    },

    /* ================= AUTHOR ================= */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        description: 'User who wrote the comment',
      },
      access: {
        update: () => false, // immutable ownership
      },
    },

    /* ================= BODY ================= */
    {
      name: 'body',
      type: 'text',
      required: true,
      admin: {
        description: 'Comment text (immutable)',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= THREADING ================= */
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'channel-comments',
      admin: {
        description: 'Parent comment (for threaded replies)',
      },
      access: {
        update: () => false,
      },
    },

    {
      name: 'replies',
      type: 'relationship',
      relationTo: 'channel-comments',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Replies (computed / linked)',
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
      },
      access: {
        update: () => false,
      },
    },

    /* ================= MODERATION ================= */
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
        description: '0–1 score from moderation model',
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

export default ChannelComments
