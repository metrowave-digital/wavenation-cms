import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'

export const Articles: CollectionConfig = {
  slug: 'articles',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'author', 'publishedDate'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* --------------------- ARTICLE DETAILS --------------------- */
        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              admin: { description: 'Auto-generated if empty' },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'publishedDate',
              type: 'date',
            },

            {
              name: 'readingTime',
              type: 'number',
              admin: { description: 'Estimated minutes to read' },
            },

            {
              name: 'featureLevel',
              type: 'select',
              defaultValue: 'standard',
              options: [
                { label: 'Breaking', value: 'breaking' },
                { label: 'Spotlight', value: 'spotlight' },
                { label: 'Featured', value: 'featured' },
                { label: 'Standard', value: 'standard' },
              ],
            },
          ],
        },

        /* ---------------------- AUTHORING ---------------------- */
        {
          label: 'Authors',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'profiles',
              required: true,
            },
            {
              name: 'contributors',
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

        /* ---------------------- CONTENT ---------------------- */
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },

            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
            },

            {
              name: 'body',
              type: 'richText',
              required: true,
            },

            {
              name: 'contentBlocks',
              type: 'blocks',
              blocks: [
                {
                  slug: 'textBlock',
                  fields: [{ name: 'text', type: 'richText' }],
                },
                {
                  slug: 'imageBlock',
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'caption', type: 'text' },
                  ],
                },
                {
                  slug: 'embedBlock',
                  fields: [
                    { name: 'embedUrl', type: 'text' },
                    { name: 'caption', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },

        /* ---------------------- TAXONOMY ---------------------- */
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

        /* ---------------------- RELATED CONTENT ---------------------- */
        {
          label: 'Relationships',
          fields: [
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
            },
            {
              name: 'relatedMedia',
              type: 'relationship',
              relationTo: [
                'tracks',
                'albums',
                'films',
                'vod',
                'podcasts',
                'podcast-episodes',
                'shows',
                'episodes',
              ],
              hasMany: true,
            },
          ],
        },

        /* ---------------------- ENGAGEMENT ---------------------- */
        {
          label: 'Engagement',
          fields: [
            {
              name: 'comments',
              type: 'relationship',
              relationTo: 'comments',
              hasMany: true,
            },

            {
              name: 'reviews',
              type: 'relationship',
              relationTo: 'reviews',
              hasMany: true,
            },

            {
              name: 'reactions',
              type: 'relationship',
              relationTo: 'comment-reactions',
              hasMany: true,
            },
          ],
        },

        /* ---------------------- SEO ---------------------- */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ---------------------- ANALYTICS + AUDIT ---------------------- */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'views', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'shares', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'likes', type: 'number', defaultValue: 0, admin: { readOnly: true } },
              ],
            },
          ],
        },

        {
          label: 'Audit',
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
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // Auto slug
        if (data.title && !data.slug) {
          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }

        return data
      },
    ],
  },
}
