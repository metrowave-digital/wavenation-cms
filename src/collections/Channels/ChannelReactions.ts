import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelReactions: CollectionConfig = {
  slug: 'channel-reactions',

  admin: {
    group: 'Creator Channels',
    defaultColumns: ['reaction', 'user', 'post', 'comment'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked (for counts + display)
     - Create: logged-in users only
     - Update: never (immutable)
     - Delete:
         • user can remove their own reaction (soft moderation)
         • staff/admin can moderate
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: AccessControl.isLoggedIn,

    update: () => false, // reactions are immutable

    delete: ({ req, data }) => {
      if (!req?.user) return false

      // Admin / staff override
      if (AccessControl.isAdminRole(req)) return true
      if (AccessControl.hasRoleAtOrAbove(req, 'staff' as any)) return true

      // User can remove their own reaction
      const reactionUserId =
        typeof data?.user === 'string'
          ? data.user
          : typeof data?.user === 'object'
            ? data.user?.id
            : null

      return String(reactionUserId) === String(req.user.id)
    },
  },

  fields: [
    /* ================= TARGET ================= */
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'channel-posts',
      admin: {
        description: 'Reaction target (post)',
      },
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'channel-comments',
      admin: {
        description: 'Reaction target (comment)',
      },
    },

    /* ================= ACTOR ================= */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        description: 'User who reacted',
      },
      access: {
        update: () => false, // cannot change ownership
      },
    },

    /* ================= REACTION ================= */
    {
      name: 'reaction',
      type: 'select',
      required: true,
      options: ['👍', '🔥', '💯', '😂', '😍', '😢'].map((v) => ({
        label: v,
        value: v,
      })),
      access: {
        update: () => false, // immutable
      },
    },
  ],

  /* -----------------------------------------------------------
     INDEXES & VALIDATION
  ----------------------------------------------------------- */
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Enforce: reaction must belong to either post OR comment (not both)
        if (!data?.post && !data?.comment) {
          throw new Error('Reaction must reference a post or a comment.')
        }
        if (data?.post && data?.comment) {
          throw new Error('Reaction cannot reference both a post and a comment.')
        }

        return data
      },
    ],
  },
}

export default ChannelReactions
