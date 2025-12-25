import type { CollectionConfig } from 'payload'
import { isStaffAccess } from '@/access/control'

export const Inbox: CollectionConfig = {
  slug: 'inbox',

  admin: {
    useAsTitle: 'id',
    group: 'Communications',
    defaultColumns: ['user', 'type', 'isRead', 'priority', 'createdAt'],
  },

  /* ============================================================
     ACCESS (COARSE — SAFE)
  ============================================================ */
  access: {
    read: ({ req }) => Boolean(req?.user),
    create: ({ req }) => Boolean(req?.user), // system / backend
    update: ({ req }) => Boolean(req?.user),
    delete: ({ req }) => Boolean(req?.user),
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------
     * OWNER
     --------------------------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: { update: () => false },
    },

    /* ---------------------------------------------------------
     * TYPE
     --------------------------------------------------------- */
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Message', value: 'message' },
        { label: 'Thread Reply', value: 'thread-reply' },
        { label: 'Notification', value: 'notification' },
        { label: 'Mention', value: 'mention' },
        { label: 'Follow', value: 'follow' },
        { label: 'Review', value: 'review' },
        { label: 'Comment', value: 'comment' },
        { label: 'Reaction', value: 'reaction' },
        { label: 'System Alert', value: 'system' },
      ],
    },

    /* ---------------------------------------------------------
     * STATUS
     --------------------------------------------------------- */
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
      access: { update: () => false },
    },

    /* ---------------------------------------------------------
     * ACTOR
     --------------------------------------------------------- */
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'profiles',
      access: { update: () => false },
    },

    /* ---------------------------------------------------------
     * RELATIONS (UNCHANGED)
     --------------------------------------------------------- */
    {
      name: 'message',
      type: 'relationship',
      relationTo: 'messages',
      admin: { condition: (d) => d?.type === 'message' },
    },
    {
      name: 'threadReply',
      type: 'relationship',
      relationTo: 'messages',
      admin: { condition: (d) => d?.type === 'thread-reply' },
    },
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      admin: { condition: (d) => d?.type === 'notification' },
    },
    {
      name: 'mentionSource',
      type: 'relationship',
      relationTo: ['comments', 'messages', 'reviews'],
      admin: { condition: (d) => d?.type === 'mention' },
    },
    {
      name: 'follower',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { condition: (d) => d?.type === 'follow' },
    },
    {
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
      admin: { condition: (d) => d?.type === 'review' },
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      admin: { condition: (d) => d?.type === 'comment' },
    },
    {
      name: 'reaction',
      type: 'relationship',
      relationTo: ['review-reactions', 'message-reactions', 'comment-reactions'],
      admin: { condition: (d) => d?.type === 'reaction' },
    },

    /* ---------------------------------------------------------
     * PREVIEW
     --------------------------------------------------------- */
    {
      name: 'previewText',
      type: 'text',
    },

    /* ---------------------------------------------------------
     * AI / MODERATION
     --------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true },
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

  /* ============================================================
     HOOKS — ENFORCEMENT
  ============================================================ */
  hooks: {
    beforeChange: [
      async ({ req, data, operation, req: { payload } }) => {
        if (!req?.user) return data

        /* ------------------------------------------------------
           Audit + ownership
        ------------------------------------------------------ */
        if (operation === 'create') {
          data.createdBy = req.user.id
          data.actor = data.actor || req.user.id
        }
        data.updatedBy = req.user.id

        /* ------------------------------------------------------
           Auto priority
        ------------------------------------------------------ */
        if (
          operation === 'create' &&
          ['system', 'reaction', 'review', 'thread-reply'].includes(data.type)
        ) {
          data.priority = 'high'
        }

        /* ------------------------------------------------------
           Preview fallback
        ------------------------------------------------------ */
        if (!data.previewText) {
          data.previewText = `[${data.type}]`
        }

        /* ------------------------------------------------------
           Prevent duplicate inbox entries
        ------------------------------------------------------ */
        if (operation === 'create') {
          const existing = await payload.find({
            collection: 'inbox',
            where: {
              and: [
                { user: { equals: data.user } },
                { type: { equals: data.type } },
                { message: { equals: data.message } },
              ],
            },
            limit: 1,
          })

          if (existing.docs.length > 0) {
            throw new Error('Duplicate inbox entry blocked.')
          }
        }

        return data
      },
    ],
  },
}
