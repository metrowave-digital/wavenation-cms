import type { CollectionConfig, PayloadRequest } from 'payload'
import { seoFields } from '../../fields/seo'

const isAdmin = ({ req }: { req: PayloadRequest }) => {
  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  return roles.includes('admin') || roles.includes('super-admin')
}

export const Shows: CollectionConfig = {
  slug: 'shows',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'showType', 'status', 'primaryHost'],
    group: 'Content',
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
        /* ------------------ TAB 1 — Details ------------------ */
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
            },

            {
              name: 'showType',
              type: 'select',
              required: true,
              defaultValue: 'radio',
              options: [
                { label: 'Radio Show', value: 'radio' },
                { label: 'TV Show', value: 'tv' },
              ],
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
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'coverArt',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '40%' },
                },
                {
                  name: 'bannerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '60%' },
                },
              ],
            },

            {
              name: 'brandColor',
              type: 'text',
            },
          ],
        },

        /* ------------------ TAB 2 — Crew ------------------ */
        {
          label: 'Crew',
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
          ],
        },

        /* ------------------ TAB 3 — Episodes (TV only) ------------------ */
        {
          label: 'Episodes',
          admin: { condition: (data) => data?.showType === 'tv' },
          fields: [
            {
              name: 'episodes',
              type: 'relationship',
              relationTo: 'episodes',
              hasMany: true,
            },
            {
              name: 'seasons',
              type: 'array',
              fields: [
                { name: 'seasonNumber', type: 'number', required: true },
                { name: 'seasonTitle', type: 'text' },
                { name: 'seasonDescription', type: 'textarea' },
              ],
            },
          ],
        },

        /* ------------------ TAB 4 — Radio Scheduling ------------------ */
        {
          label: 'Scheduling',
          admin: { condition: (data) => data?.showType === 'radio' },
          fields: [
            {
              name: 'schedules',
              type: 'relationship',
              relationTo: 'schedule',
              hasMany: true,
              admin: { description: 'Select schedule blocks from Schedule.ts' },
            },
          ],
        },

        /* ------------------ TAB 5 — Tags + Categories ------------------ */
        {
          label: 'Taxonomy',
          fields: [
            {
              name: 'genre',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
          ],
        },

        /* ------------------ TAB 6 — SEO ------------------ */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ------------------ TAB 7 — Analytics ------------------ */
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
                  admin: { readOnly: true },
                },
                { name: 'playsCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'likesCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                {
                  name: 'engagementScore',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        /* ------------------ TAB 8 — Audit ------------------ */
        {
          label: 'Audit',
          fields: [
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true, position: 'sidebar' },
            },
            {
              name: 'updatedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true, position: 'sidebar' },
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
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
