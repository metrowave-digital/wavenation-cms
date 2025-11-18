import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'
import { generateSlug } from '../hooks/generateSlug'
import { setAuthor } from '../hooks/setAuthor'

export const Articles: CollectionConfig = {
  slug: 'articles',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
  },

  versions: { drafts: true },

  access: {
    read: ({ req }) => (!req.user ? { status: { equals: 'published' } } : true),

    create: allowAdminsAnd(['editor', 'creator', 'contributor', 'host-dj']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug, setAuthor],
  },

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
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
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
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
