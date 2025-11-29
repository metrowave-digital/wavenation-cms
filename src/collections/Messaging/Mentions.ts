import type { CollectionConfig } from 'payload'

export const Mentions: CollectionConfig = {
  slug: 'mentions',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['mentionedUser', 'actor', 'sourceType', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user), // created by system frontend
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ----------------------------------------------------------
     * WHO WAS MENTIONED?
     ---------------------------------------------------------- */
    {
      name: 'mentionedUser',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* ----------------------------------------------------------
     * WHO DID THE MENTIONING?
     ---------------------------------------------------------- */
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* ----------------------------------------------------------
     * WHERE DID THE MENTION OCCUR?
     * messages, comments, reviews, articles, etc.
     ---------------------------------------------------------- */
    {
      name: 'sourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Message', value: 'message' },
        { label: 'Comment', value: 'comment' },
        { label: 'Review', value: 'review' },
        { label: 'Article', value: 'article' },
        { label: 'System', value: 'system' },
      ],
    },

    {
      name: 'sourceItem',
      type: 'relationship',
      relationTo: ['messages', 'comments', 'reviews', 'articles'],
      required: true,
      admin: {
        description: 'The exact item where the mention happened.',
      },
    },

    /* ----------------------------------------------------------
     * OPTIONAL MEDIA CONTEXT (track, film, podcast, etc.)
     * Useful for when a mention occurs inside a media discussion.
     ---------------------------------------------------------- */
    {
      name: 'mediaType',
      type: 'select',
      admin: {
        description: 'Optional — mention refers to a specific media item.',
      },
      options: [
        'tracks',
        'albums',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'articles',
        'playlists',
        'charts',
      ].map((m) => ({ label: m, value: m })),
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'articles',
        'playlists',
        'charts',
      ],
      admin: {
        condition: (data) => !!data?.mediaType,
        description: 'Optional media item referenced by the mention.',
      },
    },

    /* ----------------------------------------------------------
     * PREVIEW TEXT
     ---------------------------------------------------------- */
    {
      name: 'previewText',
      type: 'text',
      admin: {
        description: 'Excerpt of the message/comment/review where the mention appears.',
      },
    },

    /* ----------------------------------------------------------
     * NOTIFICATION + INBOX ATTACHMENT (auto-trigger)
     ---------------------------------------------------------- */
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      admin: { description: 'Notification tied to this mention.' },
    },

    {
      name: 'inboxEntry',
      type: 'relationship',
      relationTo: 'inbox',
      admin: { description: 'Inbox entry representing this mention.' },
    },

    /* ----------------------------------------------------------
     * MODERATION / AI TOXICITY
     ---------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'AI-estimated toxicity score (0–1).',
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
    {
      name: 'isFlagged',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Flag this mention for moderation.',
      },
    },

    /* ----------------------------------------------------------
     * AUDIT
     ---------------------------------------------------------- */
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
      async ({ req, data, operation }) => {
        /* ------------------------------------------------------
         * AUDIT
         ------------------------------------------------------ */
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        /* ------------------------------------------------------
         * Auto-preview for UI display
         ------------------------------------------------------ */
        if (!data.previewText && data.sourceType !== 'system') {
          data.previewText = '[mention]'
        }

        return data
      },
    ],
  },
}
