import type { CollectionConfig } from 'payload'

export const ChannelSchedules: CollectionConfig = {
  slug: 'channel-schedules',

  admin: {
    group: 'Creator Channels',
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
    },

    { name: 'title', type: 'text', required: true },

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

    { name: 'scheduledAt', type: 'date' },

    {
      name: 'recurrence',
      type: 'group',
      admin: {
        condition: (data) => {
          return data?.scheduleType === 'recurring'
        },
      },
      fields: [
        {
          name: 'frequency',
          type: 'select',
          options: ['daily', 'weekly', 'monthly'].map((v) => ({
            label: v,
            value: v,
          })),
        },
        { name: 'interval', type: 'number', defaultValue: 1 },
        { name: 'endDate', type: 'date' },
      ],
    },

    {
      name: 'payload',
      type: 'json',
      admin: {
        description: 'Metadata for the scheduled event',
      },
    },
  ],
}
