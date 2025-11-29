import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',

  admin: {
    useAsTitle: 'title',
    group: 'Engagement',
    defaultColumns: ['title', 'type', 'recipient', 'isRead', 'createdAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('system')),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ------------------------------------------------------
     * NOTIFICATION META
     ------------------------------------------------------ */
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Short notification headline.',
      },
    },

    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The notification content shown to the user.',
      },
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },

        { label: 'Comment', value: 'comment' },
        { label: 'Reply', value: 'reply' },

        { label: 'Review', value: 'review' },
        { label: 'Reaction', value: 'reaction' },

        { label: 'Follow', value: 'follow' },
        { label: 'Message', value: 'message' },

        { label: 'Release Alert', value: 'release' },
        { label: 'Playlist Update', value: 'playlist' },

        { label: 'Article Published', value: 'article' },
        { label: 'Show Update', value: 'show' },
        { label: 'Episode Release', value: 'episode' },
        { label: 'Podcast Release', value: 'podcast' },

        { label: 'Chart Update', value: 'chart' },

        { label: 'System Alert', value: 'system' },
      ],
    },

    /* ------------------------------------------------------
     * DELIVERY SETTINGS
     ------------------------------------------------------ */
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
      name: 'urgent',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Mark notification as high priority.' },
    },

    /* ------------------------------------------------------
     * WHO SENT IT?
     ------------------------------------------------------ */
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { description: 'User who triggered the notification.' },
    },

    /* ------------------------------------------------------
     * WHO RECEIVES IT?
     ------------------------------------------------------ */
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: { description: 'User who receives the notification.' },
    },

    /* ------------------------------------------------------
     * MEDIA ATTACHMENTS — dynamic linking
     ------------------------------------------------------ */
    {
      name: 'mediaType',
      type: 'select',
      admin: { description: 'Optional — attach media to this notification.' },
      options: [
        'tracks',
        'albums',
        'films',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'vod',
        'articles',
        'reviews',
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
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'vod',
        'articles',
        'reviews',
        'playlists',
        'charts',
      ],
      admin: {
        description: 'Attach specific content this notification refers to.',
        condition: (data) => !!data?.mediaType,
      },
    },

    /* ------------------------------------------------------
     * ACTION BUTTONS (CTA)
     ------------------------------------------------------ */
    {
      name: 'ctaLabel',
      type: 'text',
      admin: {
        description: "Button label, e.g., 'View', 'Open Now', 'Reply'.",
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      admin: {
        description: 'Where the user is taken when clicking the CTA.',
      },
    },

    /* ------------------------------------------------------
     * OPTIONAL EXTRA METADATA
     ------------------------------------------------------ */
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Any custom data passed to the frontend (JSON).',
      },
    },

    /* ------------------------------------------------------
     * AUDIT
     ------------------------------------------------------ */
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

  /* ------------------------------------------------------
   * HOOKS
   ------------------------------------------------------ */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user) {
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
