import type { CollectionConfig } from 'payload'
import { isStaffAccess } from '@/access/control'

export const Mentions: CollectionConfig = {
  slug: 'mentions',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
    defaultColumns: ['mentionedUser', 'actor', 'sourceType', 'createdAt'],
  },

  /* ============================================================
     ACCESS (COARSE-GRAINED)
  ============================================================ */
  access: {
    read: ({ req }) => Boolean(req?.user),
    create: ({ req }) => Boolean(req?.user),
    update: () => false, // immutable
    delete: ({ req }) => Boolean(req?.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ----------------------------------------------------------
     * CORE RELATIONSHIPS
     ---------------------------------------------------------- */
    {
      name: 'mentionedUser',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: {
        update: () => false,
      },
    },

    /* ----------------------------------------------------------
     * SOURCE
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
    },

    /* ----------------------------------------------------------
     * OPTIONAL MEDIA CONTEXT
     ---------------------------------------------------------- */
    {
      name: 'mediaType',
      type: 'select',
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
        condition: (data) => Boolean(data?.mediaType),
      },
    },

    /* ----------------------------------------------------------
     * PREVIEW
     ---------------------------------------------------------- */
    {
      name: 'previewText',
      type: 'text',
    },

    /* ----------------------------------------------------------
     * DELIVERY
     ---------------------------------------------------------- */
    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
    },

    {
      name: 'inboxEntry',
      type: 'relationship',
      relationTo: 'inbox',
    },

    /* ----------------------------------------------------------
     * MODERATION / AI
     ---------------------------------------------------------- */
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
    {
      name: 'isFlagged',
      type: 'checkbox',
      defaultValue: false,
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

  /* ============================================================
     HOOKS — ENFORCEMENT
  ============================================================ */
  hooks: {
    beforeChange: [
      async ({ req, data, operation, req: { payload } }) => {
        if (!req?.user) return data

        /* ------------------------------------------------------
           Audit
        ------------------------------------------------------ */
        if (operation === 'create') {
          data.createdBy = req.user.id
          data.actor = req.user.id // 🔒 prevent spoofing
        }
        data.updatedBy = req.user.id

        /* ------------------------------------------------------
           Preview fallback
        ------------------------------------------------------ */
        if (!data.previewText && data.sourceType !== 'system') {
          data.previewText = '[mention]'
        }

        /* ------------------------------------------------------
           Prevent duplicate mentions
        ------------------------------------------------------ */
        if (operation === 'create') {
          const existing = await payload.find({
            collection: 'mentions',
            where: {
              and: [
                { mentionedUser: { equals: data.mentionedUser } },
                { sourceType: { equals: data.sourceType } },
                { sourceItem: { equals: data.sourceItem } },
              ],
            },
            limit: 1,
          })

          if (existing.docs.length > 0) {
            throw new Error('This user has already been mentioned here.')
          }
        }

        return data
      },
    ],
  },
}
