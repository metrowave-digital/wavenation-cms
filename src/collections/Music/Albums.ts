import type { CollectionConfig, CollectionBeforeChangeHook, AccessArgs } from 'payload'
import { seoFields } from '../../fields/seo'

/* -------------------------------
   TYPE-SAFE ADMIN CHECK
-------------------------------- */
const isAdmin = ({ req }: AccessArgs) => {
  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  return roles.includes('admin') || roles.includes('super-admin')
}

/* -------------------------------
   BEFORE CHANGE HOOK (TS SAFE)
-------------------------------- */
const albumBeforeChange: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  // AUDIT FIELDS
  if (req.user) {
    if (operation === 'create') data.createdBy = req.user.id
    data.updatedBy = req.user.id
  }

  // SLUG AUTO-GENERATION
  if (data.title && !data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return data
}

/* -------------------------------
   COLLECTION CONFIG
-------------------------------- */
export const Albums: CollectionConfig = {
  slug: 'albums',

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'primaryArtist', 'releaseYear', 'albumType'],
  },

  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* -----------------------------------------------------------
         * TAB 1 – ALBUM INFO
         ----------------------------------------------------------- */
        {
          label: 'Album Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if empty' },
            },
            {
              name: 'albumType',
              type: 'select',
              required: true,
              defaultValue: 'album',
              options: [
                { label: 'Album', value: 'album' },
                { label: 'EP', value: 'ep' },
                { label: 'Single', value: 'single' },
                { label: 'Compilation', value: 'compilation' },
                { label: 'Mixtape', value: 'mixtape' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'releaseYear', type: 'number', admin: { width: '50%' } },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'released',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Released', value: 'released' },
                    { label: 'Unreleased', value: 'unreleased' },
                    { label: 'Preview', value: 'preview' },
                  ],
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 2 – ARTISTS
         ----------------------------------------------------------- */
        {
          label: 'Artists',
          fields: [
            {
              name: 'primaryArtist',
              type: 'relationship',
              required: true,
              relationTo: 'profiles',
            },
            {
              name: 'featuredArtists',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 3 – COVER ART
         ----------------------------------------------------------- */
        {
          label: 'Album Art',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Album cover' },
            },
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 4 – TRACKS
         ----------------------------------------------------------- */
        {
          label: 'Tracks',
          fields: [
            {
              name: 'tracks',
              type: 'relationship',
              relationTo: 'tracks',
              hasMany: true,
              admin: { description: 'Add tracks assigned to this album' },
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 5 – METADATA
         ----------------------------------------------------------- */
        {
          label: 'Metadata',
          fields: [
            {
              name: 'genre',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 6 – PLAYLISTS
         ----------------------------------------------------------- */
        {
          label: 'Playlists',
          fields: [
            {
              name: 'playlists',
              type: 'relationship',
              relationTo: 'playlists',
              hasMany: true,
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 7 – SEO
         ----------------------------------------------------------- */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* -----------------------------------------------------------
         * TAB 8 – ANALYTICS
         ----------------------------------------------------------- */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'streams',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'likes',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'shares',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'engagementScore',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
              ],
            },
          ],
        },

        /* -----------------------------------------------------------
         * TAB 9 – SYSTEM (AUDIT)
         ----------------------------------------------------------- */
        {
          label: 'System',
          fields: [
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
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [albumBeforeChange],
  },
}
