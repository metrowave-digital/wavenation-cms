import type { CollectionConfig, PayloadRequest } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

const isAdmin = ({ req }: { req: PayloadRequest }) => {
  const roles = Array.isArray((req.user as any)?.roles) ? (req.user as any).roles : []
  return roles.includes('admin') || roles.includes('super-admin')
}

export const PodcastEpisodes: CollectionConfig = {
  slug: 'podcast-episodes',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'episodeNumber', 'podcast', 'status'],
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
        // =======================================================
        // TAB 1 — EPISODE DETAILS
        // =======================================================
        {
          label: 'Details',
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
              type: 'row',
              fields: [
                {
                  name: 'episodeNumber',
                  type: 'number',
                  required: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'seasonNumber',
                  type: 'number',
                  admin: { width: '33%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  admin: { width: '33%' },
                  defaultValue: 'published',
                  options: [
                    { label: 'Published', value: 'published' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' },
                  ],
                },
              ],
            },

            { name: 'publishedDate', type: 'date' },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(), // FIXED
            },
          ],
        },

        // =======================================================
        // TAB 2 — AUDIO SOURCE
        // =======================================================
        {
          label: 'Audio Source',
          fields: [
            {
              name: 'audioProvider',
              type: 'select',
              required: true,
              defaultValue: 'cloudflare',
              options: [
                { label: 'Cloudflare Stream', value: 'cloudflare' },
                { label: 'S3 / R2 (MP3)', value: 's3' },
                { label: 'External URL', value: 'external' },
              ],
            },

            {
              name: 'cloudflareAudioId',
              type: 'text',
              admin: {
                condition: (data) => data?.audioProvider === 'cloudflare',
                description: 'Cloudflare audio UID',
              },
            },
            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.audioProvider === 'cloudflare',
              },
            },

            {
              name: 's3AudioFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.audioProvider === 's3',
              },
            },

            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.audioProvider === 'external',
              },
            },
          ],
        },

        // =======================================================
        // TAB 3 — RELATIONSHIPS
        // =======================================================
        {
          label: 'Relationships',
          fields: [
            {
              name: 'podcast',
              type: 'relationship',
              relationTo: 'podcasts',
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
            {
              name: 'producers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
          ],
        },

        // =======================================================
        // TAB 4 — METADATA
        // =======================================================
        {
          label: 'Metadata',
          fields: [
            { name: 'runtimeMinutes', type: 'number' },

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

            {
              name: 'transcript',
              type: 'richText',
              editor: lexicalEditor(), // FIXED
            },
          ],
        },

        // =======================================================
        // TAB 5 — EXTRAS
        // =======================================================
        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              labels: { singular: 'Clip', plural: 'Clips' },
              fields: [
                { name: 'title', type: 'text' },
                {
                  name: 'audio',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },

            {
              name: 'promos',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                {
                  name: 'audio',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },

        // =======================================================
        // TAB 6 — PLAYLISTS
        // =======================================================
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

        // =======================================================
        // TAB 7 — SEO
        // =======================================================
        {
          label: 'SEO',
          fields: [seoFields],
        },

        // =======================================================
        // TAB 8 — ANALYTICS
        // =======================================================
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'plays',
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

        // ----------------------------------------------------
        // TAB 9 — SYSTEM
        // ----------------------------------------------------
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
        const user = (req.user as any)?.id

        if (user) {
          if (operation === 'create') data.createdBy = user
          data.updatedBy = user
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
