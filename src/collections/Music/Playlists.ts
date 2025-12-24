import type { CollectionConfig, Access } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/* ============================================================
   COLLECTION
============================================================ */

export const Playlists: CollectionConfig = {
  slug: 'playlists',

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'type', 'visibility', 'sortOrder'],
  },

  access: {
    read: AccessControl.isPublic,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    /* ---------------- BASIC ---------------- */
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
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
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

    /* ---------------- 🔒 PRESERVED FIELD ---------------- */
    {
      name: 'sortOrder',
      type: 'text',
      admin: {
        description: 'Legacy playlist sort order (stored as text)',
        position: 'sidebar',
      },
    },

    /* ---------------- MEDIA ITEMS ---------------- */
    {
      name: 'items',
      type: 'relationship',
      hasMany: true,
      relationTo: ['podcasts', 'podcast-episodes', 'vod', 'episodes', 'tracks', 'films'],
      admin: {
        condition: (data) => data?.type !== 'tracks',
      },
    },

    /* ---------------- MANUAL TRACKS ---------------- */
    {
      label: 'Manual Music Entries',
      type: 'collapsible',
      admin: { condition: (data) => data?.type === 'tracks' },
      fields: [
        {
          name: 'manualTracks',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'artist', type: 'text', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'album', type: 'text' },
                { name: 'duration', type: 'text' },
              ],
            },
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'externalUrl',
              type: 'text',
            },
          ],
        },
      ],
    },

    /* ---------------- VISIBILITY ---------------- */
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

    /* ---------------- AUDIT ---------------- */
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
        if (!req.user) return data

        if (operation === 'create') {
          data.createdBy = String(req.user.id)
        }
        data.updatedBy = String(req.user.id)

        if (data.type === 'tracks') {
          data.items = []
        } else {
          data.manualTracks = []
        }

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

export default Playlists
