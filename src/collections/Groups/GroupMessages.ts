import type { CollectionConfig, Access } from 'payload'

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
 * Can update / delete message if:
 * - Admin override
 * - Staff+
 * - Message author
 * - Group owner / admin / moderator
 */
const canEditGroupMessage: Access = async ({ req, id }) => {
  if (!req?.user) return false

  const userId = String(req.user.id)

  // 🔑 Global overrides
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true

  if (!id) return false

  const message = await req.payload.findByID({
    collection: 'group-messages',
    id,
  })

  // Message author owns it
  if (toStringID(message.author) === userId) return true

  // Load group for role-based permissions
  const groupId = toStringID(message.group)
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

export const GroupMessages: CollectionConfig = {
  slug: 'group-messages',

  admin: {
    useAsTitle: 'text',
    group: 'Community',
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: canEditGroupMessage,
    delete: canEditGroupMessage,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE
    -------------------------------------------------------- */
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },

    /* --------------------------------------------------------
       RELATIONSHIPS
    -------------------------------------------------------- */
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
    },
    {
      name: 'parentMessage',
      type: 'relationship',
      relationTo: 'group-messages',
      admin: {
        description: 'If this is a reply.',
      },
    },

    /* --------------------------------------------------------
       ATTACHMENTS
    -------------------------------------------------------- */
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Any image/video attachments.',
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

export default GroupMessages
