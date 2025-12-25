import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelSchedules: CollectionConfig = {
  slug: 'channel-schedules',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'scheduleType', 'scheduledAt'],
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

  fields: [
    /* ================= CHANNEL ================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: {
        description: 'Channel this schedule belongs to',
      },
    },

    /* ================= BASIC ================= */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'scheduleType',
      type: 'select',
      required: true,
      options: [
        { label: 'One-Time', value: 'one-time' },
        { label: 'Recurring', value: 'recurring' },
      ],
    },

    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Post', value: 'post' },
        { label: 'Livestream', value: 'livestream' },
        { label: 'Announcement', value: 'announcement' },
      ],
    },

    {
      name: 'scheduledAt',
      type: 'date',
      admin: {
        description: 'Execution time for one-time events',
      },
    },

    /* ================= RECURRENCE ================= */
    {
      name: 'recurrence',
      type: 'group',
      admin: {
        condition: (data) => data?.scheduleType === 'recurring',
        description: 'Rules for recurring schedules',
      },
      fields: [
        {
          name: 'frequency',
          type: 'select',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
        },
        {
          name: 'interval',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Repeat every N units',
          },
        },
        {
          name: 'endDate',
          type: 'date',
        },
      ],
    },

    /* ================= PAYLOAD ================= */
    {
      name: 'payload',
      type: 'json',
      admin: {
        description:
          'Metadata for the scheduled action (post id, livestream id, announcement body, etc.)',
      },
      access: {
        update: AccessControl.isStaffAccessField, // creators can’t inject raw jobs
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

export default ChannelSchedules
