import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelModerators: CollectionConfig = {
  slug: 'channel-moderators',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'user',
    defaultColumns: ['user', 'channel', 'role'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (HIGH TRUST COLLECTION)
     - Read: staff + channel owner
     - Create: channel owner OR staff
     - Update: staff only
     - Delete: staff or admin only
  ----------------------------------------------------------- */
  access: {
    read: ({ req }) => {
      if (!req?.user) return false
      if (AccessControl.isAdminRole(req)) return true
      return AccessControl.hasRoleAtOrAbove(req, 'staff' as any)
    },

    create: ({ req, data }) => {
      if (!req?.user) return false

      // Staff/Admin override
      if (AccessControl.hasRoleAtOrAbove(req, 'staff' as any)) return true

      // Channel owner can assign moderators
      return AccessControl.canEditChannel(req, {
        creator: data?.channel,
      })
    },

    update: ({ req }) => {
      if (!req?.user) return false
      return AccessControl.hasRoleAtOrAbove(req, 'staff' as any)
    },

    delete: ({ req }) => {
      if (!req?.user) return false
      return AccessControl.hasRoleAtOrAbove(req, 'staff' as any)
    },
  },

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this moderator is assigned to',
      },
    },

    /* ================= USER ================= */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        description: 'User being granted moderation permissions',
      },
      access: {
        update: () => false, // immutable once assigned
      },
    },

    /* ================= ROLE ================= */
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Manager', value: 'manager' },
        { label: 'Editor', value: 'editor' },
        { label: 'Moderator', value: 'moderator' },
      ],
      admin: {
        description: 'High-level role. Fine-grained permissions are defined below.',
      },
      access: {
        update: AccessControl.isStaffAccessField, // prevent privilege escalation
      },
    },

    /* ================= PERMISSIONS ================= */
    {
      name: 'permissions',
      type: 'json',
      admin: {
        description: 'Fine-grained overrides (optional). Managed by staff or system only.',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= AUDIT ================= */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { update: () => false },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS (ENTERPRISE SAFE)
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req?.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default ChannelModerators
