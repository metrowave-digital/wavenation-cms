import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

import * as AccessControl from '@/access/control'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'primaryHost', 'category'],
  },

  /* -----------------------------------------------------------
     ACCESS (ENTERPRISE SAFE — NO DATA CHANGES)
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔐 API key OR logged-in
    create: AccessControl.isAdmin,
    update: AccessControl.isAdmin,
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        // ------------------------------------------------------------------
        // TAB 1 — PODCAST DETAILS
        // ------------------------------------------------------------------
        {
          label: 'Details',
          fields: [
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
              admin: {
                description: 'Auto-generated if empty.',
              },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'active',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Season Break', value: 'season-break' },
                { label: 'Archived', value: 'archived' },
                { label: 'Ended', value: 'ended' },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        // ------------------------------------------------------------------
        // TAB 2 — BRANDING
        // ------------------------------------------------------------------
        {
          label: 'Branding',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'coverArt',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'bannerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'brandColor',
              type: 'text',
            },
          ],
        },

        // ------------------------------------------------------------------
        // TAB 3 — PEOPLE
        // ------------------------------------------------------------------
        {
          label: 'People',
          fields: [
            {
              name: 'primaryHost',
              type: 'relationship',
              relationTo: 'profiles',
              required: true,
            },
            {
              name: 'coHosts',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'contributors',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'producers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'editors',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'guests',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
          ],
        },

        // ------------------------------------------------------------------
        // TAB 4 — EPISODES
        // ------------------------------------------------------------------
        {
          label: 'Episodes',
          fields: [
            {
              name: 'episodes',
              type: 'relationship',
              relationTo: 'podcast-episodes',
              hasMany: true,
            },
          ],
        },

        // ------------------------------------------------------------------
        // TAB 5 — VIDEO / VOD (OPTIONAL)
        // ------------------------------------------------------------------
        {
          label: 'Video / VOD',
          fields: [
            {
              name: 'vod',
              type: 'relationship',
              relationTo: 'vod',
              admin: {
                description:
                  'Optional video or vodcast version of this podcast (studio recording, simulcast, or companion video)',
              },
            },
          ],
        },

        // ------------------------------------------------------------------
        // TAB 6 — PLAYLISTS
        // ------------------------------------------------------------------
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

        // ------------------------------------------------------------------
        // TAB 7 — TAXONOMY
        // ------------------------------------------------------------------
        {
          label: 'Taxonomy',
          fields: [
            {
              name: 'category',
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

        // ------------------------------------------------------------------
        // TAB 8 — SEO
        // ------------------------------------------------------------------
        {
          label: 'SEO',
          fields: [seoFields],
        },

        // ------------------------------------------------------------------
        // TAB 9 — ANALYTICS
        // ------------------------------------------------------------------
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'followersCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'playsCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'likesCount',
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

        // ------------------------------------------------------------------
        // TAB 10 — SYSTEM
        // ------------------------------------------------------------------
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
    beforeChange: [
      ({ data = {}, req, operation }) => {
        const userId = req.user ? String(req.user.id) : undefined

        if (userId) {
          if (operation === 'create') data.createdBy = userId
          data.updatedBy = userId
        }

        if (data?.title && !data?.slug) {
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

export default Podcasts
