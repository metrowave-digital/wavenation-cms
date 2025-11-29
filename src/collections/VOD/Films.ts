import type { CollectionConfig, PayloadRequest } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

const isAdmin = ({ req }: { req: PayloadRequest }) => {
  const roles = Array.isArray((req.user as any)?.roles) ? ((req.user as any).roles as string[]) : []
  return roles.includes('admin') || roles.includes('super-admin')
}

export const Films: CollectionConfig = {
  slug: 'films',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'filmType', 'releaseYear', 'status'],
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
                  defaultValue: 'published',
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
                description: 'Cloudflare video UID',
              },
            },

            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'cloudflare',
                description: 'HLS/DASH playback URL',
              },
            },

            {
              name: 's3VideoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.videoProvider === 's3',
                description: 'Upload MP4 or WEBM',
              },
            },

            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'external',
                description: 'YouTube, Vimeo, or custom stream URL',
              },
            },
          ],
        },

        {
          label: 'Branding',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'poster', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                {
                  name: 'bannerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
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

        {
          label: 'Cast & Crew',
          fields: [
            { name: 'directors', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'writers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'producers', type: 'relationship', relationTo: 'profiles', hasMany: true },

            {
              name: 'cast',
              type: 'array',
              labels: { singular: 'Cast Member', plural: 'Film Cast' },
              fields: [
                { name: 'profile', type: 'relationship', relationTo: 'profiles' },
                { name: 'roleName', type: 'text' },
              ],
            },
          ],
        },

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

        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              labels: { singular: 'Clip', plural: 'Clips' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },

            {
              name: 'behindTheScenes',
              type: 'array',
              labels: { singular: 'BTS', plural: 'BTS' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },

            {
              name: 'promos',
              type: 'array',
              labels: { singular: 'Promo', plural: 'Promos' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        {
          label: 'SEO',
          fields: [seoFields],
        },

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
      async ({ data = {}, req, operation }) => {
        if (req.user) {
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
