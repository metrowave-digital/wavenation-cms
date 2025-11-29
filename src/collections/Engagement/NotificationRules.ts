import type { CollectionConfig } from 'payload'

export const NotificationRules: CollectionConfig = {
  slug: 'notification-rules',

  admin: {
    useAsTitle: 'name',
    group: 'Automations',
    defaultColumns: ['name', 'eventType', 'status'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    /* ---------------------------------------------------------
     * RULE NAME
     --------------------------------------------------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    /* ---------------------------------------------------------
     * EVENT TRIGGERS
     --------------------------------------------------------- */
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'New Message', value: 'message.created' },
        { label: 'New Comment', value: 'comment.created' },
        { label: 'New Review', value: 'review.created' },
        { label: 'New Follow', value: 'follow.created' },
        { label: 'New Track Release', value: 'track.released' },
        { label: 'New Episode Release', value: 'episode.released' },
        { label: 'New Article Published', value: 'article.published' },
        { label: 'Playlist Update', value: 'playlist.updated' },
        { label: 'Chart Update', value: 'chart.updated' },
        { label: 'System Alert', value: 'system.alert' },
      ],
    },

    /* ---------------------------------------------------------
     * TARGET RECIPIENTS
     --------------------------------------------------------- */
    {
      name: 'sendTo',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'All Users', value: 'all' },
        { label: 'Followers of Actor', value: 'followers' },
        { label: 'Content Owner', value: 'owner' },
        { label: 'Participants (Chat/Thread)', value: 'participants' },
        { label: 'Admins Only', value: 'admins' },
      ],
    },

    {
      name: 'additionalRecipients',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: { description: 'Optional manual recipients' },
    },

    /* ---------------------------------------------------------
     * NOTIFICATION PAYLOAD TEMPLATE
     --------------------------------------------------------- */
    {
      name: 'titleTemplate',
      type: 'text',
      admin: { description: 'Use {{variables}} from event.' },
    },

    {
      name: 'messageTemplate',
      type: 'textarea',
      admin: { description: 'Dynamic message body.' },
    },

    {
      name: 'ctaLabelTemplate',
      type: 'text',
    },

    {
      name: 'ctaUrlTemplate',
      type: 'text',
    },

    /* ---------------------------------------------------------
     * ATTACH MEDIA
     --------------------------------------------------------- */
    {
      name: 'mediaType',
      type: 'select',
      admin: { description: 'Optional auto-attached media type.' },
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

    /* ---------------------------------------------------------
     * RULE STATUS
     --------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
      ],
    },

    /* ---------------------------------------------------------
     * AUDIT
     --------------------------------------------------------- */
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
      ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}
