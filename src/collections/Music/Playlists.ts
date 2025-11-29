import type { CollectionConfig } from 'payload'

export const Playlists: CollectionConfig = {
  slug: 'playlists',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'items'],
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
    // -----------------------------------------------------
    // BASIC FIELDS
    // -----------------------------------------------------
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
      admin: { description: 'Auto-generated if empty.' },
    },

    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Optional description for the playlist.' },
    },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Playlist cover image.' },
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'mixed',
      options: [
        { label: 'Podcast Playlist', value: 'podcasts' },
        { label: 'Podcast Episodes', value: 'podcast-episodes' },
        { label: 'VOD Playlist', value: 'vod' },
        { label: 'TV Episodes', value: 'tv-episodes' },
        { label: 'Music Playlist', value: 'tracks' },
        { label: 'Mixed Media', value: 'mixed' },
      ],
    },

    // -----------------------------------------------------
    // MEDIA ITEMS
    // -----------------------------------------------------
    {
      name: 'items',
      type: 'relationship',
      hasMany: true,
      relationTo: [
        'podcasts',
        'podcast-episodes',
        'vod',
        'episodes', // you confirmed this exists
        'tracks',
        'films',
      ],
      admin: {
        condition: (data) => data?.type !== 'tracks',
        description: 'Media items for non-music playlists.',
      },
    },

    // -----------------------------------------------------
    // MANUAL TRACKS
    // -----------------------------------------------------
    {
      label: 'Manual Music Entries',
      type: 'collapsible',
      admin: {
        condition: (data) => data?.type === 'tracks',
      },
      fields: [
        {
          name: 'manualTracks',
          type: 'array',
          labels: {
            singular: 'Manual Track Entry',
            plural: 'Manual Track Entries',
          },
          admin: {
            description: 'For tracks not yet created in the Tracks collection.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'artist',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },

            {
              type: 'row',
              fields: [
                { name: 'album', type: 'text', admin: { width: '50%' } },
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Example: 3:25',
                  },
                },
              ],
            },

            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional artwork.' },
            },

            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                description: 'Optional link to Spotify, Apple Music, YouTube, etc.',
              },
            },
          ],
        },
      ],
    },

    // -----------------------------------------------------
    // SORT + VISIBILITY
    // -----------------------------------------------------
    {
      name: 'sortOrder',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Order', value: 'manual' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Most Popular', value: 'popular' },
      ],
    },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Unlisted', value: 'unlisted' },
      ],
    },

    // -----------------------------------------------------
    // AUDIT
    // -----------------------------------------------------
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

  // -----------------------------------------------------
  // HOOKS (Correct Payload v3 typing)
  // -----------------------------------------------------
  hooks: {
    beforeChange: [
      ({
        data,
        req,
        operation,
      }: {
        data: any
        req: import('payload').PayloadRequest
        operation: 'create' | 'update'
      }) => {
        // Track creator/updater
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // Auto-slug
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}
