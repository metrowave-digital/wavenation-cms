import type { CollectionConfig, Access, FieldAccess, AccessArgs } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/* ============================================================
   ROLE HELPERS
============================================================ */

const getUserRoles = (req: AccessArgs['req']): string[] =>
  Array.isArray(req.user?.roles) ? req.user.roles : []

const isAdmin = (roles: string[]) =>
  roles.includes('admin') || roles.includes('super-admin') || roles.includes('system')

const isStaff = (roles: string[]) => isAdmin(roles) || roles.includes('staff')

const isModeratorRole = (roles: string[]) => isStaff(roles) || roles.includes('moderator')

/* ============================================================
   COLLECTION-LEVEL ACCESS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/**
 * Collection-level: owner OR admin/staff
 */
const isOwnerOrAdmin: Access = async ({ req, id }) => {
  if (!req.user) return false

  const roles = getUserRoles(req)
  if (isAdmin(roles)) return true

  if (id == null) return false

  const group = await req.payload.findByID({
    collection: 'groups',
    id: id as string | number, // ensure correct type for TS
  })

  const ownerId = typeof group.owner === 'string' ? group.owner : (group.owner as any)?.id

  return ownerId === req.user.id
}

/* ============================================================
   FIELD-LEVEL ACCESS (BOOLEAN-ONLY)
============================================================ */

/**
 * Field-level: admin-only
 */
const isAdminFieldAccess: FieldAccess = ({ req }) => {
  const roles = getUserRoles(req)
  return isAdmin(roles)
}

/**
 * Field-level: admin/staff/moderator
 */
const isModeratorFieldAccess: FieldAccess = ({ req }) => {
  const roles = getUserRoles(req)
  return isModeratorRole(roles)
}

/**
 * Field-level: can manage membership-related fields
 * Uses the current doc instead of findByID to avoid TS id issues.
 */
const canManageGroupMembersField: FieldAccess = ({ req, doc }) => {
  if (!req.user) return false
  const roles = getUserRoles(req)

  // Admin/staff always allowed
  if (isStaff(roles)) return true

  const group = doc as any
  if (!group) return false

  // Owner allowed
  const ownerId = typeof group.owner === 'string' ? group.owner : group.owner?.id

  if (ownerId === req.user.id) return true

  // Group admins allowed
  const adminIDs = (group.admins || []).map((a: any) => (typeof a === 'string' ? a : a?.id))
  if (adminIDs.includes(req.user.id)) return true

  // Group moderators allowed
  const modIDs = (group.moderators || []).map((m: any) => (typeof m === 'string' ? m : m?.id))
  if (modIDs.includes(req.user.id)) return true

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
        /* ============================================================
           TAB 1 — BASIC INFO
        ============================================================ */
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: "Group name (e.g., 'Worship Leaders Circle', 'Indie Artists Guild')",
              },
            },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                description: 'Auto-generated from group name; used in URLs.',
              },
            },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
              admin: {
                description: 'Describe what this group is about.',
              },
            },

            {
              name: 'category',
              type: 'select',
              admin: {
                description: 'Choose the main category of this group.',
              },
              options: [
                'Music',
                'Film',
                'TV / Streaming',
                'Podcasts',
                'Digital Media',
                'Culture',
                'Lifestyle',
                'Faith & Spirituality',
                'Gospel',
                'Hip-Hop',
                'R&B',
                'Soul',
                'Southern Soul',
                'Business / Entrepreneurship',
                'Leadership',
                'Social Justice',
                'Community',
                'Youth',
                'Creative Collective',
                'Events',
              ].map((label) => ({
                label,
                value: label.toLowerCase().replace(/[\s/]+/g, '-'),
              })),
            },

            {
              name: 'tags',
              type: 'select',
              hasMany: true,
              admin: {
                description: 'Additional topics this group covers.',
              },
              options: [
                'Music Discussion',
                'Worship',
                'Prayer',
                'Production',
                'Songwriting',
                'Film Production',
                'Acting',
                'Directing',
                'Podcasting',
                'Reviews',
                'Events',
                'Festivals',
                'Live Shows',
                'Spiritual Growth',
                'Community Service',
                'Networking',
                'Creatives',
                'Business',
                'Marketing',
                'Mental Health',
                'Youth & Young Adult',
              ].map((label) => ({
                label,
                value: label.toLowerCase().replace(/[\s&]+/g, '-'),
              })),
            },

            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Group avatar icon.' },
            },
            {
              name: 'coverPhoto',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Large banner image for the group page.',
              },
            },
          ],
        },

        /* ============================================================
           TAB 2 — OWNER & ADMINS
        ============================================================ */
        {
          label: 'Owner & Admins',
          fields: [
            {
              name: 'owner',
              type: 'relationship',
              relationTo: 'profiles',
              required: true,
              admin: {
                description: 'The creator of the group.',
              },
              access: {
                update: isAdminFieldAccess,
              },
            },
            {
              name: 'admins',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: {
                update: canManageGroupMembersField,
              },
            },
            {
              name: 'moderators',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: {
                update: canManageGroupMembersField,
              },
            },
          ],
        },

        /* ============================================================
           TAB 3 — MEMBERSHIP SETTINGS
        ============================================================ */
        {
          label: 'Membership',
          fields: [
            {
              name: 'privacy',
              type: 'select',
              defaultValue: 'public',
              required: true,
              admin: {
                description:
                  'Public = anyone can join. Private = request required. Hidden = invite-only and invisible.',
              },
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
                { label: 'Hidden', value: 'hidden' },
              ],
            },

            {
              name: 'autoApproveMembers',
              type: 'checkbox',
              label: 'Auto-approve joining members',
              defaultValue: false,
            },

            {
              name: 'members',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: {
                update: canManageGroupMembersField,
              },
            },

            {
              name: 'pendingMembers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: {
                update: canManageGroupMembersField,
              },
            },

            {
              name: 'blockedProfiles',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              access: {
                update: canManageGroupMembersField,
              },
            },

            {
              name: 'memberCount',
              type: 'number',
              defaultValue: 0,
              admin: { readOnly: true },
            },
          ],
        },

        /* ============================================================
           TAB 4 — POSTS, THREADS, EVENTS
        ============================================================ */
        {
          label: 'Content & Engagement',
          fields: [
            {
              name: 'posts',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
            },
            {
              name: 'chatThreads',
              type: 'relationship',
              relationTo: 'chats',
              hasMany: true,
            },
            {
              name: 'events',
              type: 'relationship',
              relationTo: 'events',
              hasMany: true,
            },
          ],
        },

        /* ============================================================
           TAB 5 — ANNOUNCEMENTS
        ============================================================ */
        {
          label: 'Announcements',
          fields: [
            {
              name: 'announcements',
              type: 'relationship',
              relationTo: 'notifications',
              hasMany: true,
            },
          ],
        },

        /* ============================================================
           TAB 6 — SAFETY & MODERATION
        ============================================================ */
        {
          label: 'Safety & Moderation',
          fields: [
            {
              name: 'flaggedForReview',
              type: 'checkbox',
              access: {
                update: isModeratorFieldAccess,
              },
            },
            {
              name: 'banStatus',
              type: 'select',
              defaultValue: 'active',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Terminated', value: 'terminated' },
              ],
              access: {
                update: isModeratorFieldAccess,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bannedAt',
                  type: 'date',
                  admin: { width: '50%' },
                  access: {
                    update: isModeratorFieldAccess,
                  },
                },
                {
                  name: 'banReason',
                  type: 'textarea',
                  admin: { width: '50%' },
                  access: {
                    update: isModeratorFieldAccess,
                  },
                },
              ],
            },
            {
              name: 'internalNotes',
              type: 'richText',
              editor: lexicalEditor(),
              admin: {
                description: 'Admin-only moderation notes.',
              },
              access: {
                read: isAdminFieldAccess,
                update: isAdminFieldAccess,
              },
            },
          ],
        },

        /* ============================================================
           TAB 7 — ANALYTICS
        ============================================================ */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'views',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '33%' },
                },
                {
                  name: 'engagementScore',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '33%' },
                },
                {
                  name: 'activityLevel',
                  type: 'select',
                  defaultValue: 'low',
                  admin: { readOnly: true, width: '33%' },
                  options: [
                    { label: 'Low', value: 'low' },
                    { label: 'Moderate', value: 'moderate' },
                    { label: 'High', value: 'high' },
                  ],
                },
              ],
            },
          ],
        },

        /* ============================================================
           TAB 8 — SYSTEM & AUDIT
        ============================================================ */
        {
          label: 'System & Audit',
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

  /* ============================================================
     HOOKS
  ============================================================ */
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (!req.user) return data

        const roles = getUserRoles(req)

        if (operation === 'create') {
          // Owner is always creator
          data.owner = req.user.id

          // Owner becomes first admin
          data.admins = [req.user.id]

          // Staff auto-becomes moderator
          if (isStaff(roles)) {
            data.moderators = [req.user.id]
          }

          data.createdBy = req.user.id
        }

        data.updatedBy = req.user.id

        // Slug generation
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
