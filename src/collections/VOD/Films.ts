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
const canReadFilms: Access = ({ req }) => {
  if (req?.user) return true
  return AccessControl.apiLockedRead({ req } as any)
}

/**
 * CREATE
 * - Admin + Staff
 */
const canCreateFilms: Access = ({ req }) =>
  AccessControl.isAdmin({ req }) || AccessControl.isStaff({ req })

/**
 * UPDATE
 * - Admin override
 * - Staff override
 * - Creator (createdBy) can update their own film
 */
const canUpdateFilms: Access = async ({ req, id }: AccessArgs) => {
  if (!req?.user) return false

  if (AccessControl.isAdmin({ req })) return true
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  const film = await req.payload.findByID({
    collection: 'films',
    id: String(id),
    depth: 0,
  })

  const ownerId =
    typeof (film as any).createdBy === 'string'
      ? (film as any).createdBy
      : (film as any).createdBy?.id

  return ownerId === String(req.user.id)
}

/**
 * DELETE
 * - Admin only
 */
const canDeleteFilms: Access = ({ req }) => AccessControl.isAdmin({ req })

/* ============================================================
   COLLECTION
============================================================ */

export const Films: CollectionConfig = {
  slug: 'films',

  labels: {
    singular: 'Film',
    plural: 'Films',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'filmType', 'releaseYear', 'status', 'updatedAt'],
  },

  access: {
    read: canReadFilms,
    create: canCreateFilms,
    update: canUpdateFilms,
    delete: canDeleteFilms,
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
           TAB 1 — FILM INFO
        ------------------------------------------------------------------ */
        {
          label: 'Film Info',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if empty.' },
            },

            {
              name: 'filmType',
              type: 'select',
              required: true,
              defaultValue: 'feature',
              options: [
                { label: 'Feature Film', value: 'feature' },
                { label: 'Documentary', value: 'documentary' },
                { label: 'Short Film', value: 'short' },
                { label: 'Series Pilot', value: 'pilot' },
                { label: 'Music Film', value: 'music-film' },
              ],
            },

            {
              type: 'row',
              fields: [
                { name: 'releaseYear', type: 'number', admin: { width: '50%' } },
                {
                  name: 'status',
                  type: 'select',
                  defaultValue: 'draft',
                  options: [
                    { label: 'Published', value: 'published' },
                    { label: 'Coming Soon', value: 'coming-soon' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'Archived', value: 'archived' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
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
                { name: 'poster', type: 'upload', relationTo: 'media' },
                { name: 'bannerImage', type: 'upload', relationTo: 'media' },
              ],
            },

            {
              name: 'stillImages',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
            },

            { name: 'brandColor', type: 'text' },
          ],
        },

        /* ------------------------------------------------------------------
           TAB 4 — CAST & CREW
        ------------------------------------------------------------------ */
        {
          label: 'Cast & Crew',
          fields: [
            { name: 'directors', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'writers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'producers', type: 'relationship', relationTo: 'profiles', hasMany: true },

            {
              name: 'cast',
              type: 'array',
              fields: [
                { name: 'profile', type: 'relationship', relationTo: 'profiles' },
                { name: 'roleName', type: 'text' },
              ],
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
                { label: 'G / All Ages', value: 'G' },
                { label: 'PG', value: 'PG' },
                { label: 'PG-13', value: 'PG-13' },
                { label: 'TV-MA', value: 'TV-MA' },
              ],
            },
            { name: 'genre', type: 'relationship', relationTo: 'categories' },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
            { name: 'trailer', type: 'upload', relationTo: 'media' },
            {
              name: 'transcript',
              type: 'richText',
              editor: lexicalEditor(),
            },
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
           TAB 7 — SEO
        ------------------------------------------------------------------ */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ------------------------------------------------------------------
           TAB 8 — ANALYTICS
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
           TAB 9 — SYSTEM
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

export default Films
