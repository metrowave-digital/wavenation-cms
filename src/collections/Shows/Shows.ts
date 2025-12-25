// src/collections/Shows.ts

import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'

import {
  isPublic,
  isEditorOrAbove,
  isStaffAccess,
  isAdmin,
  isStaffAccessField,
  isAdminField,
} from '@/access/control'

/* ============================================================
   COLLECTION
============================================================ */

export const Shows: CollectionConfig = {
  slug: 'shows',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'showType', 'status', 'primaryHost'],
    group: 'Content',
  },

  /* ------------------------------------------------------------
     ACCESS CONTROL
  ------------------------------------------------------------ */
  access: {
    read: isPublic,
    create: isEditorOrAbove,
    update: isStaffAccess,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* =====================================================
           TAB 1 — DETAILS
        ===================================================== */
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
              admin: {
                description: 'Hex color for show branding (e.g. #00E5FF)',
              },
            },
          ],
        },

        /* =====================================================
           TAB 2 — CREW
        ===================================================== */
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

        /* =====================================================
           TAB 3 — EPISODES (TV ONLY)
        ===================================================== */
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

        /* =====================================================
           TAB 4 — RADIO SCHEDULING
        ===================================================== */
        {
          label: 'Scheduling',
          admin: { condition: (data) => data?.showType === 'radio' },
          fields: [
            {
              name: 'schedules',
              type: 'relationship',
              relationTo: 'schedule',
              hasMany: true,
              admin: {
                description: 'Schedule blocks (used for EPG + Live Radio)',
              },
            },
          ],
        },

        /* =====================================================
           TAB 5 — TAXONOMY
        ===================================================== */
        {
          label: 'Taxonomy',
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

        /* =====================================================
           TAB 6 — SEO
        ===================================================== */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* =====================================================
           TAB 7 — ANALYTICS (LOCKED)
        ===================================================== */
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
                  access: { update: isStaffAccessField },
                  admin: { readOnly: true },
                },
                {
                  name: 'playsCount',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: isStaffAccessField },
                  admin: { readOnly: true },
                },
                {
                  name: 'likesCount',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: isStaffAccessField },
                  admin: { readOnly: true },
                },
                {
                  name: 'engagementScore',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: isStaffAccessField },
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        /* =====================================================
           TAB 8 — AUDIT (ADMIN ONLY)
        ===================================================== */
        {
          label: 'Audit',
          fields: [
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              access: { update: isAdminField },
              admin: { readOnly: true, position: 'sidebar' },
            },
            {
              name: 'updatedBy',
              type: 'relationship',
              relationTo: 'users',
              access: { update: isAdminField },
              admin: { readOnly: true, position: 'sidebar' },
            },
          ],
        },
      ],
    },
  ],

  /* ------------------------------------------------------------
     HOOKS
  ------------------------------------------------------------ */
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
