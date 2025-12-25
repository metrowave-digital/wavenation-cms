import type { CollectionConfig, Access, AccessArgs } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ID NORMALIZATION (SAFE)
============================================================ */

const toStringID = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object' && value && 'id' in value) {
    const id = (value as any).id
    if (typeof id === 'string') return id
    if (typeof id === 'number') return String(id)
  }
  return null
}

/* ============================================================
   ACCESS HELPERS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req?.user)

/**
 * Can update / delete group post if:
 * - Admin override
 * - Staff+
 * - Post author
 * - Group owner / admin / moderator
 */
const canEditGroupPost: Access = async ({ req, id }) => {
  if (!req?.user) return false

  const userId = String(req.user.id)

  // 🔑 Global overrides
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true

  if (!id) return false

  const post = await req.payload.findByID({
    collection: 'group-posts',
    id,
  })

  // Author owns post
  if (toStringID(post.author) === userId) return true

  // Load group to check permissions
  const groupId = toStringID(post.group)
  if (!groupId) return false

  const group = await req.payload.findByID({
    collection: 'groups',
    id: groupId,
  })

  // Group owner
  if (toStringID(group.owner) === userId) return true

  // Group admins
  if (Array.isArray(group.admins) && group.admins.map(toStringID).includes(userId)) {
    return true
  }

  // Group moderators
  if (Array.isArray(group.moderators) && group.moderators.map(toStringID).includes(userId)) {
    return true
  }

  return false
}

/* ============================================================
   COLLECTION
============================================================ */

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
    update: canEditGroupPost,
    delete: canEditGroupPost,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       MEDIA
    -------------------------------------------------------- */
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Images / videos attached to the post.',
      },
    },

    /* --------------------------------------------------------
       RELATIONSHIPS
    -------------------------------------------------------- */
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
      admin: { readOnly: true },
    },

    /* --------------------------------------------------------
       ENGAGEMENT
    -------------------------------------------------------- */
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
      admin: {
        description: 'Message-thread comments for this post.',
      },
    },

    /* --------------------------------------------------------
       MODERATION
    -------------------------------------------------------- */
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: ({ req }) => Boolean(req?.user && hasRoleAtOrAbove(req, Roles.MODERATOR)),
      },
    },
    {
      name: 'flagged',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'For moderation review.',
      },
      access: {
        update: ({ req }) => Boolean(req?.user && hasRoleAtOrAbove(req, Roles.MODERATOR)),
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req?.user) return data

        if (operation === 'create') {
          data.author = String(req.user.id)
        }

        return data
      },
    ],
  },
}

export default GroupPosts
