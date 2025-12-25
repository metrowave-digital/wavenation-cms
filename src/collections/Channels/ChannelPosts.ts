import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelPosts: CollectionConfig = {
  slug: 'channel-posts',

  admin: {
    useAsTitle: 'title',
    group: 'Creator Channels',
    defaultColumns: ['title', 'channel', 'visibility', 'postType', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked
     - Create: channel owner / moderator / staff
     - Update: channel owner / moderator / staff
     - Delete: admin only
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

    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this post belongs to',
      },
    },

    /* ================= BASIC ================= */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'postType',
      type: 'select',
      required: true,
      options: ['text', 'image', 'video', 'audio', 'gallery', 'embed', 'poll', 'announcement'].map(
        (v) => ({ label: v, value: v }),
      ),
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
        description: 'Controls who can see this post. Tiered access is staff-controlled.',
      },
      access: {
        update: AccessControl.isStaffAccessField, // creators can’t self-monetize
      },
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: {
        condition: (_, data) => data?.visibility === 'tiers',
        description: 'Tiers allowed to view this post',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= CONTENT ================= */
    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (_, data) => data?.postType === 'text' || data?.postType === 'announcement',
      },
    },

    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, data) => data?.postType === 'image' || data?.postType === 'gallery',
      },
    },

    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, data) => data?.postType === 'video',
      },
    },

    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, data) => data?.postType === 'audio',
      },
    },

    {
      name: 'embed',
      type: 'text',
      admin: {
        condition: (_, data) => data?.postType === 'embed',
        description: 'Embed URL (YouTube, Vimeo, SoundCloud, Bandcamp, etc.)',
      },
    },

    /* ================= POLL ================= */
    {
      name: 'pollOptions',
      type: 'array',
      admin: {
        condition: (_, data) => data?.postType === 'poll',
      },
      fields: [
        {
          name: 'option',
          type: 'text',
          required: true,
        },
        {
          name: 'votes',
          type: 'number',
          defaultValue: 0,
          access: {
            update: () => false, // votes only via endpoint
          },
        },
      ],
    },

    /* ================= RELATIONSHIPS ================= */
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'channel-media',
      hasMany: true,
      admin: {
        description: 'Associated channel media',
      },
    },

    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'channel-comments',
      hasMany: true,
      admin: {
        readOnly: true,
      },
      access: {
        update: () => false,
      },
    },

    /* ================= AUDIT ================= */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'profiles',
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

export default ChannelPosts
