import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelAnnouncements: CollectionConfig = {
  slug: 'channel-announcements',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'visibility', 'pinned', 'expiresAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked
     - Create: channel owner / moderator / staff
     - Update: channel owner / moderator / staff
     - Delete: staff / admin only
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: ({ req, data }) =>
      AccessControl.canEditChannel(req, {
        creator: data?.channel,
      }),

    update: ({ req, data }) =>
      AccessControl.canEditChannel(req, {
        creator: data?.channel,
      }),

    delete: ({ req }) => AccessControl.hasRoleAtOrAbove(req, 'staff' as any),
  },

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this announcement belongs to',
      },
    },

    /* ================= CONTENT ================= */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description: 'Announcement content (immutable once published)',
      },
    },

    /* ================= VISIBILITY / MONETIZATION ================= */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'Tier-Restricted', value: 'tiers' },
      ],
      admin: {
        description: 'Audience gate for this announcement. Tiered access is staff-controlled.',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: {
        condition: (_, data) => data?.visibility === 'tiers',
        description: 'Which tiers may see this announcement',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= PINNING & LIFETIME ================= */
    {
      name: 'pinned',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Pinned announcements appear prominently in channel views.',
      },
    },

    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration. Announcement will be hidden after this date.',
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

export default ChannelAnnouncements
