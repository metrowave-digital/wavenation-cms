import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelLivestreams: CollectionConfig = {
  slug: 'channel-livestreams',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'streamState', 'scheduledStart'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read for discovery/search
     - Controlled writes
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔓 search-safe
    create: AccessControl.isStaff, // scheduling control
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
  },

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
    },

    /* ================= BASIC INFO ================= */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* ================= VISIBILITY ================= */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: ['public', 'subscribers', 'tiers'],
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: {
        condition: (_, data) => data?.visibility === 'tiers',
      },
    },

    /* ================= SCHEDULING ================= */
    {
      name: 'scheduledStart',
      type: 'date',
    },

    {
      name: 'scheduledEnd',
      type: 'date',
    },

    {
      name: 'streamState',
      type: 'select',
      defaultValue: 'scheduled',
      options: ['scheduled', 'live', 'ended', 'canceled'],
    },

    /* ================= STREAM DATA ================= */
    {
      name: 'streamUrl',
      type: 'text',
    },

    {
      name: 'dvrPlaybackUrl',
      type: 'text',
    },

    {
      name: 'chatEnabled',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'liveChatArchive',
      type: 'relationship',
      relationTo: 'chat-media',
      hasMany: true,
    },

    /* ================= AUDIT ================= */
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

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user) {
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

export default ChannelLivestreams
