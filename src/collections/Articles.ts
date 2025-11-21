import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'
import { generateSlug } from '../hooks/generateSlug'
import { setAuthor } from '../hooks/setAuthor'

export const Articles: CollectionConfig = {
  slug: 'articles',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'editorialStatus', 'author', 'isBreaking', 'publishedAt'],
  },

  versions: { drafts: true },

  access: {
    read: ({ req }) => (!req.user ? { editorialStatus: { equals: 'published' } } : true),
    create: allowAdminsAnd(['editor', 'creator', 'contributor', 'host-dj']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug, setAuthor],
  },

  fields: [
    /* TITLE + SLUG */
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    /* EDITORIAL WORKFLOW */
    {
      name: 'editorialStatus',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Needs Review', value: 'review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Reviewed By',
    },

    {
      name: 'coAuthors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Collaborating Authors',
    },

    {
      name: 'publishAt',
      type: 'date',
      label: 'Schedule Publish Time',
    },

    /* FLAGS */
    { name: 'isBreaking', type: 'checkbox', defaultValue: false },
    { name: 'isPinned', type: 'checkbox', defaultValue: false },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },

    /* AUTHOR */
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },

    /* TAXONOMY */
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    /* CONTENT */
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText', required: true },

    /* MEDIA */
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
    },

    { name: 'videoEmbed', type: 'text' },
    {
      name: 'audioClip',
      type: 'upload',
      relationTo: 'media',
    },

    /* ASSOCIATED SHOWS + CONTENT */
    {
      name: 'relatedShows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
    },

    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },

    /* COMMENTS (Threaded) */
    {
      name: 'comments',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'user', type: 'relationship', relationTo: 'users' },
        { name: 'comment', type: 'textarea', required: true },
        {
          name: 'replies',
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'user', type: 'relationship', relationTo: 'users' },
            { name: 'comment', type: 'textarea' },
            {
              name: 'createdAt',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
            },
          ],
        },
        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
        },
        { name: 'approved', type: 'checkbox', defaultValue: true },
      ],
    },

    /* SEO */
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'keywords', type: 'text' },
        { name: 'shareImage', type: 'upload', relationTo: 'media' },
      ],
    },

    /* METRICS */
    { name: 'viewCount', type: 'number', defaultValue: 0 },
    { name: 'likeCount', type: 'number', defaultValue: 0 },
  ],
}
