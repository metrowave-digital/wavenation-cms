import type { CollectionConfig, Access, FieldAccess, AccessArgs } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ID NORMALIZATION (CRITICAL – KEEP)
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

const normalizeIDArray = (values: unknown[]): string[] =>
  values.map(toStringID).filter(Boolean) as string[]

/* ============================================================
   COLLECTION-LEVEL ACCESS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req?.user)

/**
 * Owner OR Admin
 * Admin override always wins
 */
const isOwnerOrAdmin: Access = async ({ req, id }) => {
  if (!req?.user) return false

  // 🔑 GLOBAL ADMIN OVERRIDE
  if (isAdminRole(req)) return true

  const docID = toStringID(id)
  if (!docID) return false

  const group = await req.payload.findByID({
    collection: 'groups',
    id: docID,
  })

  const ownerId = toStringID(group.owner)
  const userId = String(req.user.id)

  return ownerId === userId
}

/* ============================================================
   FIELD-LEVEL ACCESS (BOOLEAN ONLY – PAYLOAD SAFE)
============================================================ */

const isAdminFieldAccess: FieldAccess = ({ req }) => Boolean(req?.user && isAdminRole(req))

const isModeratorFieldAccess: FieldAccess = ({ req }) =>
  Boolean(req?.user && hasRoleAtOrAbove(req, Roles.MODERATOR))

/**
 * Admins, staff, owners, group admins, group moderators
 */
const canManageGroupMembersField: FieldAccess = ({ req, doc }) => {
  if (!req?.user) return false

  const userId = String(req.user.id)

  // 🔑 Absolute overrides
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true

  const group = doc as any
  if (!group) return false

  if (toStringID(group.owner) === userId) return true
  if (normalizeIDArray(group.admins || []).includes(userId)) return true
  if (normalizeIDArray(group.moderators || []).includes(userId)) return true

  return false
}

/* ============================================================
   COLLECTION
============================================================ */

export const Groups: CollectionConfig = {
  slug: 'groups',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'privacy', 'owner', 'memberCount'],
    group: 'Community',
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: isOwnerOrAdmin,
    delete: isOwnerOrAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ----------------------------------------------------
           BASIC INFO
        ---------------------------------------------------- */
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'coverPhoto',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },

        /* ----------------------------------------------------
           OWNER & ADMINS
        ---------------------------------------------------- */
        {
          label: 'Owner & Admins',
          fields: [
            {
              name: 'owner',
              type: 'relationship',
              relationTo: 'profiles',
              required: true,
              access: { update: isAdminFieldAccess },
            },
            {
              name: 'admins',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: { update: canManageGroupMembersField },
            },
            {
              name: 'moderators',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: { update: canManageGroupMembersField },
            },
          ],
        },

        /* ----------------------------------------------------
           MEMBERSHIP
        ---------------------------------------------------- */
        {
          label: 'Membership',
          fields: [
            {
              name: 'privacy',
              type: 'select',
              defaultValue: 'public',
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
                { label: 'Hidden', value: 'hidden' },
              ],
            },
            {
              name: 'members',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: { update: canManageGroupMembersField },
            },
            {
              name: 'memberCount',
              type: 'number',
              defaultValue: 0,
              admin: { readOnly: true },
            },
          ],
        },

        /* ----------------------------------------------------
           SAFETY & MODERATION
        ---------------------------------------------------- */
        {
          label: 'Safety & Moderation',
          fields: [
            {
              name: 'flaggedForReview',
              type: 'checkbox',
              access: { update: isModeratorFieldAccess },
            },
            {
              name: 'internalNotes',
              type: 'richText',
              editor: lexicalEditor(),
              access: {
                read: isAdminFieldAccess,
                update: isAdminFieldAccess,
              },
            },
          ],
        },

        /* ----------------------------------------------------
           SYSTEM
        ---------------------------------------------------- */
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
      async ({ data, req, operation }) => {
        if (!req?.user) return data

        const userId = String(req.user.id)

        if (operation === 'create') {
          data.owner = userId
          data.admins = [userId]
          data.createdBy = userId
        }

        data.updatedBy = userId

        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}

export default Groups
