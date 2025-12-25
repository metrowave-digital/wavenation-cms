import type { CollectionConfig, Access } from 'payload'
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
 * Can update / delete group event if:
 * - Admin override
 * - Staff+
 * - Event creator
 * - Group owner / admin / moderator
 */
const canEditGroupEvent: Access = async ({ req, id }) => {
  if (!req?.user) return false

  const userId = String(req.user.id)

  // 🔑 Global overrides
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true

  if (!id) return false

  const event = await req.payload.findByID({
    collection: 'group-events',
    id,
  })

  // Event creator
  if (toStringID(event.createdBy) === userId) return true

  // Load group for role-based permissions
  const groupId = toStringID(event.group)
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

export const GroupEvents: CollectionConfig = {
  slug: 'group-events',

  admin: {
    useAsTitle: 'title',
    group: 'Community',
    defaultColumns: ['title', 'group', 'start', 'createdBy'],
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: canEditGroupEvent,
    delete: canEditGroupEvent,
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
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
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
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },

    /* --------------------------------------------------------
       DATES
    -------------------------------------------------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'start',
          type: 'date',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'end',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    /* --------------------------------------------------------
       LOCATION
    -------------------------------------------------------- */
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Online URL or physical address',
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req?.user) return data

        if (operation === 'create') {
          data.createdBy = String(req.user.id)
        }

        return data
      },
    ],
  },
}

export default GroupEvents
