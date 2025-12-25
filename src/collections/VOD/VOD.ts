// src/collections/VOD/VOD.ts

import type { CollectionConfig, Access, AccessArgs } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import * as AccessControl from '@/access/control'
import { seoFields } from '../../fields/seo'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * READ
 * - Logged-in users → full access
 * - Public → API key + fetch code
 */
const canReadVOD: Access = ({ req }) => {
  if (req?.user) return true
  return AccessControl.apiLockedRead({ req } as any)
}

/**
 * CREATE
 * - Admin + Staff
 */
const canCreateVOD: Access = ({ req }) =>
  AccessControl.isAdmin({ req }) || AccessControl.isStaff({ req })

/**
 * UPDATE
 * - Admin override
 * - Staff override
 * - Creator (createdBy) can update their own VOD
 */
const canUpdateVOD: Access = async ({ req, id }: AccessArgs) => {
  if (!req?.user) return false

  if (AccessControl.isAdmin({ req })) return true
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  const vod = await req.payload.findByID({
    collection: 'vod',
    id: String(id),
    depth: 0,
  })

  const ownerId =
    typeof (vod as any).createdBy === 'string' ? (vod as any).createdBy : (vod as any).createdBy?.id

  return ownerId === String(req.user.id)
}

/**
 * DELETE
 * - Admin only (VODs are highly referenced)
 */
const canDeleteVOD: Access = ({ req }) => AccessControl.isAdmin({ req })

/* ============================================================
   COLLECTION
============================================================ */

export const VOD: CollectionConfig = {
  slug: 'vod',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'vodType', 'status', 'runtimeMinutes', 'updatedAt'],
  },

  access: {
    read: canReadVOD,
    create: canCreateVOD,
    update: canUpdateVOD,
    delete: canDeleteVOD,
  },

  timestamps: true,

  /* ============================================================
     FIELDS
  ============================================================ */
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ------------------------------------------------------------------
           TAB 1 — DETAILS
        ------------------------------------------------------------------ */
        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if left empty.' },
            },

            {
              name: 'vodType',
              type: 'select',
              required: true,
              defaultValue: 'special',
              options: [
                { label: 'Special', value: 'special' },
                { label: 'Exclusive', value: 'exclusive' },
                { label: 'Interview', value: 'interview' },
                { label: 'Music Performance', value: 'performance' },
                { label: 'Event Replay', value: 'event-replay' },
                { label: 'Sermon / Teaching', value: 'sermon' },
                { label: 'Short-form Content', value: 'short' },
                { label: 'Documentary Short', value: 'doc-short' },
                { label: 'Feature Clip', value: 'feature-clip' },
              ],
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Draft', value: 'draft' },
                { label: 'Archived', value: 'archived' },
              ],
            },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },

            {
              name: 'publishedDate',
              type: 'date',
              admin: {
                condition: (_, siblingData) => siblingData?.status === 'scheduled',
              },
            },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 2 — VIDEO SOURCE
        ------------------------------------------------------------------ */
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
              admin: { condition: (d) => d?.videoProvider === 'cloudflare' },
            },

            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: { condition: (d) => d?.videoProvider === 'cloudflare' },
            },

            {
              name: 's3VideoFile',
              type: 'upload',
              relationTo: 'media',
              admin: { condition: (d) => d?.videoProvider === 's3' },
            },

            {
              name: 'externalUrl',
              type: 'text',
              admin: { condition: (d) => d?.videoProvider === 'external' },
            },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 3 — BRANDING
        ------------------------------------------------------------------ */
        {
          label: 'Branding',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'thumbnail', type: 'upload', relationTo: 'media' },
                { name: 'bannerImage', type: 'upload', relationTo: 'media' },
              ],
            },

            {
              name: 'stillImages',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
            },

            {
              name: 'brandColor',
              type: 'text',
            },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 4 — RELATIONSHIPS
        ------------------------------------------------------------------ */
        {
          label: 'Relationships',
          fields: [
            { name: 'hosts', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'guests', type: 'relationship', relationTo: 'profiles', hasMany: true },
            {
              name: 'creators',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'relatedShows',
              type: 'relationship',
              relationTo: 'shows',
              hasMany: true,
            },
            {
              name: 'relatedEpisodes',
              type: 'relationship',
              relationTo: 'episodes',
              hasMany: true,
            },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 5 — METADATA
        ------------------------------------------------------------------ */
        {
          label: 'Metadata',
          fields: [
            { name: 'runtimeMinutes', type: 'number' },
            {
              name: 'contentRating',
              type: 'select',
              options: [
                { label: 'All Ages', value: 'G' },
                { label: 'PG', value: 'PG' },
                { label: 'PG-13', value: 'PG-13' },
                { label: 'TV-MA', value: 'TV-MA' },
              ],
            },
            { name: 'genre', type: 'relationship', relationTo: 'categories' },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
            { name: 'transcript', type: 'richText', editor: lexicalEditor() },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 6 — EXTRAS
        ------------------------------------------------------------------ */
        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'behindTheScenes',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
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

        /* ------------------------------------------------------------------
           TAB 7 — PLAYLISTS
        ------------------------------------------------------------------ */
        {
          label: 'Playlists',
          fields: [
            {
              name: 'collections',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'relationship',
                  relationTo: 'vod',
                  hasMany: true,
                },
              ],
            },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 8 — SEO
        ------------------------------------------------------------------ */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ------------------------------------------------------------------
           TAB 9 — ANALYTICS
        ------------------------------------------------------------------ */
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

        /* ------------------------------------------------------------------
           TAB 10 — SYSTEM
        ------------------------------------------------------------------ */
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

  /* ============================================================
     HOOKS
  ============================================================ */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!data) return data

        if (req?.user) {
          if (operation === 'create') data.createdBy = (req.user as any).id
          data.updatedBy = (req.user as any).id
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

export default VOD
