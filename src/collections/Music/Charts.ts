import type { CollectionConfig } from 'payload'

export const Charts: CollectionConfig = {
  slug: 'charts',

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'chartType', 'period', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => {
      const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
      return roles.includes('admin') || roles.includes('super-admin')
    },
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
     * BASIC INFO
     -------------------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },

    {
      name: 'chartType',
      type: 'select',
      required: true,
      defaultValue: 'weekly',
      options: [
        { label: 'Weekly Chart', value: 'weekly' },
        { label: 'Daily Chart', value: 'daily' },
        { label: 'Monthly Chart', value: 'monthly' },
        { label: 'Trending', value: 'trending' },
        { label: 'Staff Picks', value: 'staff-picks' },
        { label: 'Algorithmic', value: 'algorithmic' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'period',
          type: 'date',
          admin: { width: '50%', description: 'Week/Month this chart represents' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'published',
          admin: { width: '50%' },
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
        },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* --------------------------------------------------------
     * CHART POSITIONS
     -------------------------------------------------------- */
    {
      label: 'Chart Entries',
      type: 'array',
      name: 'entries',
      labels: { singular: 'Entry', plural: 'Entries' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'rank',
              type: 'number',
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'lastWeek',
              type: 'number',
              admin: { width: '20%', description: 'Previous position' },
            },
            {
              name: 'peak',
              type: 'number',
              admin: { width: '20%' },
            },
            {
              name: 'weeksOnChart',
              type: 'number',
              admin: { width: '20%' },
            },
            {
              name: 'movement',
              type: 'select',
              admin: { width: '20%' },
              options: [
                { label: 'Up', value: 'up' },
                { label: 'Down', value: 'down' },
                { label: 'New', value: 'new' },
                { label: 'Re-entry', value: 're-entry' },
                { label: 'No Change', value: 'same' },
              ],
            },
          ],
        },

        /* Track relationship */
        {
          name: 'track',
          type: 'relationship',
          relationTo: 'tracks',
          admin: {
            description: 'Use an existing track OR create manual entry below.',
          },
        },

        /* Manual track info */
        {
          name: 'manualTrackInfo',
          type: 'group',
          admin: {
            description: 'Use when the track does NOT exist in the Tracks collection.',
          },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'artist', type: 'text' },
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: { description: 'Optional link to streaming platform' },
            },
          ],
        },
      ],
    },

    /* --------------------------------------------------------
     * OPTIONAL PLAYLIST LINKING
     -------------------------------------------------------- */
    {
      name: 'playlist',
      type: 'relationship',
      relationTo: 'playlists',
      admin: {
        description: 'Optionally link this chart to a playlist.',
      },
    },

    /* --------------------------------------------------------
     * AUDIT
     -------------------------------------------------------- */
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
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (data.title && !data.slug) {
          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }

        return data
      },
    ],
  },
}
