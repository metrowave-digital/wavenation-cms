import type { CollectionConfig, Access } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

const isPostOwnerOrAdmin: Access = async ({ req, id }) => {
  if (!req.user) return false

  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  const isAdmin = roles.includes('admin') || roles.includes('super-admin')
  if (isAdmin) return true

  if (!id) return false

  const post = await req.payload.findByID({
    collection: 'group-posts',
    id,
  })

  const ownerId = typeof post.author === 'string' ? post.author : (post.author as any)?.id

  return ownerId === req.user.id
}

export const GroupPosts: CollectionConfig = {
  slug: 'group-posts',
  admin: {
    useAsTitle: 'title',
    group: 'Community',
    defaultColumns: ['title', 'group', 'author', 'createdAt'],
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: isPostOwnerOrAdmin,
    delete: isPostOwnerOrAdmin,
  },

  timestamps: true,

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Images / videos attached to the post.' },
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      defaultValue: [],
    },
    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'group-messages',
      hasMany: true,
      admin: { description: 'Message-thread comments for this post.' },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'flagged',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'For moderation review.' },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req.user) return data
        if (operation === 'create') data.author = req.user.id
        return data
      },
    ],
  },
}
