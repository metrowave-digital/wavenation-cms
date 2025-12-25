import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelLivestreams: CollectionConfig = {
  slug: 'channel-livestreams',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'streamState', 'scheduledStart', 'visibility'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked
     - Create: channel owner / moderator / staff
     - Update:
         • metadata: channel owner / moderator / staff
         • stream state & URLs: staff / system only
     - Delete: admin only
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: ({ req, data }) =>
      AccessControl.canEditChannel(req, {
        creator: data?.channel,
      }),

    update: ({ req, data }) => {
      // If stream already ended, only staff/admin may update
      if (data?.streamState === 'ended') {
        return AccessControl.hasRoleAtOrAbove(req, 'staff' as any)
      }

      return AccessControl.canEditChannel(req, {
        creator: data?.channel,
      })
    },

    delete: AccessControl.isAdmin,
  },

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this livestream belongs to',
      },
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
        description: 'Livestream visibility gate. Tiered access is staff-controlled.',
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
        description: 'Which tiers may access this livestream',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= SCHEDULING ================= */
    {
      name: 'scheduledStart',
      type: 'date',
      admin: {
        description: 'Planned start time',
      },
    },

    {
      name: 'scheduledEnd',
      type: 'date',
      admin: {
        description: 'Planned end time',
      },
    },

    /* ================= STREAM STATE ================= */
    {
      name: 'streamState',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Live', value: 'live' },
        { label: 'Ended', value: 'ended' },
        { label: 'Canceled', value: 'canceled' },
      ],
      admin: {
        description: 'Lifecycle state. Controlled by staff, system, or streaming workers.',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= STREAM INFRA (STAFF ONLY) ================= */
    {
      name: 'streamUrl',
      type: 'text',
      admin: {
        description: 'Ingest or playback URL (RTMP/HLS/DASH). Set by system or staff.',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'dvrPlaybackUrl',
      type: 'text',
      admin: {
        description: 'Post-live DVR or VOD URL. Set automatically after stream ends.',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= CHAT ================= */
    {
      name: 'chatEnabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable or disable live chat',
      },
    },

    {
      name: 'liveChatArchive',
      type: 'relationship',
      relationTo: 'chat-media',
      hasMany: true,
      admin: {
        description: 'Archived chat messages or transcripts',
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

export default ChannelLivestreams
