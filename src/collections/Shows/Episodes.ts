// src/collections/Shows/Episodes.ts

import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

export const Episodes: CollectionConfig = {
  slug: 'episodes',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'episodeNumber', 'seasonNumber', 'show', 'status'],
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
           TAB 1 — EPISODE INFO
        ===================================================== */
        {
          label: 'Episode Info',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if left empty' },
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'episodeNumber',
                  type: 'number',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'seasonNumber',
                  type: 'number',
                  admin: { width: '50%' },
                },
              ],
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'published',
              options: [
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Draft', value: 'draft' },
                { label: 'Archived', value: 'archived' },
              ],
            },

            { name: 'airDate', type: 'date' },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        /* =====================================================
           TAB 2 — VIDEO SOURCE
        ===================================================== */
        {
          label: 'Video Source',
          fields: [
            {
              name: 'videoProvider',
              type: 'select',
              required: true,
              defaultValue: 'cloudflare',
              options: [
                { label: 'Cloudflare Stream', value: 'cloudflare' },
                { label: 'S3 / R2 (MP4)', value: 's3' },
                { label: 'External URL', value: 'external' },
              ],
            },

            {
              name: 'cloudflareVideoId',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'cloudflare',
                description: 'Cloudflare Stream video UID',
              },
            },

            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'cloudflare',
                description: 'HLS / DASH playback URL',
              },
            },

            {
              name: 's3VideoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.videoProvider === 's3',
                description: 'Upload MP4 stream file',
              },
            },

            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'external',
                description: 'YouTube, Vimeo, or custom HLS URL',
              },
            },
          ],
        },

        /* =====================================================
           TAB 3 — BRANDING
        ===================================================== */
        {
          label: 'Branding',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'thumbnail',
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
              admin: { description: 'Optional HEX brand color' },
            },
          ],
        },

        /* =====================================================
           TAB 4 — RELATIONSHIPS
        ===================================================== */
        {
          label: 'Relationships',
          fields: [
            {
              name: 'show',
              type: 'relationship',
              relationTo: 'shows',
              required: true,
            },

            {
              name: 'hosts',
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

            { name: 'writers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'producers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'editors', type: 'relationship', relationTo: 'profiles', hasMany: true },
          ],
        },

        /* =====================================================
           TAB 5 — METADATA
        ===================================================== */
        {
          label: 'Metadata',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'runtimeMinutes', type: 'number', admin: { width: '33%' } },
                {
                  name: 'contentRating',
                  type: 'select',
                  admin: { width: '33%' },
                  options: [
                    { label: 'G / All Ages', value: 'G' },
                    { label: 'PG', value: 'PG' },
                    { label: 'PG-13', value: 'PG-13' },
                    { label: 'TV-MA', value: 'TV-MA' },
                  ],
                },
                {
                  name: 'genre',
                  type: 'relationship',
                  relationTo: 'categories',
                  admin: { width: '33%' },
                },
              ],
            },

            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },

            {
              name: 'transcript',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        /* =====================================================
           TAB 6 — EXTRAS
        ===================================================== */
        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'clipVideo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'promos',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        /* =====================================================
           TAB 7 — SEO
        ===================================================== */
        { label: 'SEO', fields: [seoFields] },

        /* =====================================================
           TAB 8 — ANALYTICS (LOCKED)
        ===================================================== */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'views', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'likes', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'shares', type: 'number', defaultValue: 0, admin: { readOnly: true } },
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

        /* =====================================================
           TAB 9 — AUDIT
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
