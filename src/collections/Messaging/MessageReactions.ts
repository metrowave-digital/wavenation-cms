import type { CollectionConfig } from 'payload'
import { isStaffAccess } from '@/access/control'

export const MessageReactions: CollectionConfig = {
  slug: 'message-reactions',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
  },

  access: {
    read: () => true,

    create: ({ req }) => Boolean(req?.user),

    delete: ({ req }) => Boolean(req?.user), // ownership enforced in hook

    update: () => false, // immutable
  },

  fields: [
    {
      name: 'reaction',
      type: 'relationship',
      relationTo: 'reactions',
      required: true,
    },

    {
      name: 'message',
      type: 'relationship',
      relationTo: 'messages',
      required: true,
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: { update: () => false },
    },
  ],

  /* ============================================================
     HOOKS
  ============================================================ */
  hooks: {
    /* ----------------------------------------------------------
       CREATE / UPDATE RULES
    ---------------------------------------------------------- */
    beforeChange: [
      async ({ req, data, operation, req: { payload } }) => {
        if (!req?.user) return data

        // Prevent edits entirely
        if (operation === 'update') {
          throw new Error('Reactions cannot be edited.')
        }

        // Prevent duplicate reactions
        if (operation === 'create') {
          const existing = await payload.find({
            collection: 'message-reactions',
            where: {
              and: [
                { message: { equals: data.message } },
                { user: { equals: data.user } },
                { reaction: { equals: data.reaction } },
              ],
            },
            limit: 1,
          })

          if (existing.docs.length > 0) {
            throw new Error('You already reacted to this message.')
          }
        }

        return data
      },
    ],

    /* ----------------------------------------------------------
       DELETE RULES (SEPARATE HOOK — REQUIRED)
    ---------------------------------------------------------- */
    beforeDelete: [
      async ({ req, id, req: { payload } }) => {
        if (!req?.user) {
          throw new Error('Not authenticated.')
        }

        // Staff override
        if (isStaffAccess({ req })) return

        // Fetch reaction to enforce ownership
        const reaction = await payload.findByID({
          collection: 'message-reactions',
          id,
        })

        const ownerId = typeof reaction.user === 'object' ? reaction.user.id : reaction.user

        if (String(ownerId) !== String(req.user.id)) {
          throw new Error('You may only remove your own reactions.')
        }
      },
    ],
  },
}
