import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelMedia: CollectionConfig = {
  slug: 'channel-media',

  admin: {
    useAsTitle: 'filename',
    group: 'Creator Channels',
    defaultColumns: ['filename', 'channel', 'visibility', 'createdAt'],
  },

  /* -----------------------------------------------------------
     UPLOAD CONFIG (PAYLOAD v3 SAFE)
  ----------------------------------------------------------- */
  upload: {
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
    disableLocalStorage: true,

    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'center',
      },
    ],

    // IMPORTANT:
    // Do NOT set staticURL / staticDir in v3
    // S3/R2 adapter handles URLs automatically
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked
     - Create: channel owner / moderator / staff
     - Update: never (immutable media)
     - Delete: staff / admin only
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: ({ req, data }) =>
      AccessControl.canEditChannel(req, {
        creator: data?.channel,
      }),

    update: () => false, // prevent file swapping

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
        description: 'Channel this media belongs to',
      },
    },

    /* ================= UPLOADER ================= */
    {
      name: 'uploader',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        description: 'User who uploaded this media',
      },
      access: {
        update: () => false, // immutable ownership
      },
    },

    /* ================= DESCRIPTION ================= */
    {
      name: 'description',
      type: 'textarea',
    },

    /* ================= VISIBILITY / MONETIZATION ================= */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'subscribers',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'Tier-Restricted', value: 'tiers' },
      ],
      admin: {
        description: 'Media visibility gate. Tiered access is staff-controlled.',
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
        description: 'Which tiers may access this media',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= METADATA ================= */
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Read-only technical metadata (duration, codec, dimensions, etc.)',
      },
      access: {
        update: AccessControl.isStaffAccessField, // workers / staff only
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
            data.uploader = data.uploader ?? req.user.id
          }
          data.updatedBy = req.user.id
        }

        return data
      },
    ],
  },
}

export default ChannelMedia
