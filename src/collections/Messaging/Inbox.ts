import type { CollectionConfig } from 'payload'

export const Inbox: CollectionConfig = {
  slug: 'inbox',

  admin: {
    useAsTitle: 'id',
    group: 'Communications',
    defaultColumns: ['user', 'type', 'isRead', 'priority', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user), // system and rules create entries
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------------------
     * USER OWNER OF THIS INBOX ITEM
     --------------------------------------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* ---------------------------------------------------------------------
     * TYPE OF INBOX ITEM
     --------------------------------------------------------------------- */
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

    /* ---------------------------------------------------------------------
     * STATUS & PRIORITY (smart inbox logic)
     --------------------------------------------------------------------- */
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
    },

    /* ---------------------------------------------------------------------
     * ACTOR (who triggered it)
     --------------------------------------------------------------------- */
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { description: 'User who triggered this inbox item' },
    },

    /* ---------------------------------------------------------------------
     * RELATED ENTITIES (ONE-TO-MANY RELATION, SWITCH BY TYPE)
     --------------------------------------------------------------------- */

    // Direct Message
    {
      name: 'message',
      type: 'relationship',
      relationTo: 'messages',
      admin: { condition: (data) => data?.type === 'message' },
    },

    // Thread Reply
    {
      name: 'threadReply',
      type: 'relationship',
      relationTo: 'messages',
      admin: { condition: (data) => data?.type === 'thread-reply' },
    },

    // Notification
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      admin: { condition: (data) => data?.type === 'notification' },
    },

    // Mention (comments, messages, reviews)
    {
      name: 'mentionSource',
      type: 'relationship',
      relationTo: ['comments', 'messages', 'reviews'],
      admin: { condition: (data) => data?.type === 'mention' },
    },

    // Follow event
    {
      name: 'follower',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { condition: (data) => data?.type === 'follow' },
    },

    // Review event
    {
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
      admin: { condition: (data) => data?.type === 'review' },
    },

    // Comment event
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      admin: { condition: (data) => data?.type === 'comment' },
    },

    // Reaction event
    {
      name: 'reaction',
      type: 'relationship',
      relationTo: ['review-reactions', 'message-reactions', 'comment-reactions'],
      admin: { condition: (data) => data?.type === 'reaction' },
    },

    /* ---------------------------------------------------------------------
     * CONTENT LINKS (optional deep linking support)
     --------------------------------------------------------------------- */
    {
      name: 'mediaType',
      type: 'select',
      admin: { description: 'Optional — attach media for quick navigation' },
      options: [
        'tracks',
        'albums',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'films',
        'vod',
        'articles',
        'playlists',
        'charts',
      ].map((x) => ({ label: x, value: x })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'films',
        'vod',
        'articles',
        'playlists',
        'charts',
      ],
      admin: { condition: (data) => !!data?.mediaType },
    },

    /* ---------------------------------------------------------------------
     * MESSAGE SNIPPET / PREVIEW
     --------------------------------------------------------------------- */
    {
      name: 'previewText',
      type: 'text',
      admin: {
        description: 'Short text preview displayed in Inbox UI.',
      },
    },

    /* ---------------------------------------------------------------------
     * AI TOXICITY / MODERATION (optional for mentions & messages)
     --------------------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'AI toxicity score for moderation UI',
      },
    },
    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },

    /* ---------------------------------------------------------------------
     * AUDIT
     --------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
   * HOOKS
   --------------------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        // audit
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // auto-priority assignment
        if (operation === 'create') {
          if (['system', 'reaction', 'review', 'thread-reply'].includes(data.type)) {
            data.priority = 'high'
          }
        }

        // preview autofill
        if (!data.previewText && data.message) {
          data.previewText = '[message]'
        }

        return data
      },
    ],
  },
}
