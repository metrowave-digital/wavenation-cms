import type { CollectionConfig } from 'payload'

export const EPGEntries: CollectionConfig = {
  slug: 'epg',
  labels: {
    singular: 'EPG Entry',
    plural: 'EPG Guide',
  },

  admin: {
    group: 'TV & Streaming',
    useAsTitle: 'title',
    defaultColumns: ['mode', 'contentType', 'title', 'start', 'end'],
  },

  fields: [
    /** MODE: Manual or Linked */
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'linked',
      options: [
        { label: 'Linked Content', value: 'linked' },
        { label: 'Manual Entry', value: 'manual' },
      ],
    },

    /** LINKED CONTENT (optional if mode = linked) */
    {
      name: 'content',
      type: 'relationship',
      relationTo: ['shows', 'episodes', 'films', 'vod', 'channel-livestreams', 'channel-posts'],
      admin: {
        condition: (data) => data?.mode === 'linked',
        description: 'Link to existing content (Show, Episode, Film, VOD, Livestream)',
      },
    },

    {
      name: 'contentType',
      type: 'select',
      required: true,
      defaultValue: 'episode',
      admin: { condition: (data) => data?.mode === 'linked' },
      options: [
        { label: 'Show', value: 'show' },
        { label: 'Episode', value: 'episode' },
        { label: 'Film', value: 'film' },
        { label: 'VOD', value: 'vod' },
        { label: 'Livestream', value: 'livestream' },
        { label: 'Creator Event', value: 'creator-event' },
      ],
    },

    /** MANUAL ENTRY FIELDS */
    {
      name: 'manualTitle',
      type: 'text',
      admin: {
        condition: (data) => data?.mode === 'manual',
      },
    },

    {
      name: 'manualDescription',
      type: 'textarea',
      admin: {
        condition: (data) => data?.mode === 'manual',
      },
    },

    {
      name: 'manualThumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.mode === 'manual',
      },
    },

    /** UNIVERSAL TITLE (used in UI, computed via hook if desired) */
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal or display title',
      },
    },

    {
      name: 'subtitle',
      type: 'text',
    },

    /** BROADCAST SCHEDULE */
    {
      name: 'start',
      type: 'date',
      required: true,
    },

    {
      name: 'end',
      type: 'date',
      required: true,
    },

    /** OPTIONAL CHANNEL (for multi-channel streaming lanes) */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      admin: {
        description: 'Optional: Assign to a specific channel or lane',
      },
    },

    /** OPTIONAL RECURRING RULE */
    {
      name: 'recurrence',
      type: 'group',
      admin: {
        description: 'Optional: Automatically repeat schedule',
      },
      fields: [
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
        },
        {
          name: 'daysOfWeek',
          type: 'select',
          hasMany: true,
          admin: {
            condition: (data) => data?.recurrence?.frequency === 'weekly',
          },
          options: [
            { label: 'Sunday', value: 'sun' },
            { label: 'Monday', value: 'mon' },
            { label: 'Tuesday', value: 'tue' },
            { label: 'Wednesday', value: 'wed' },
            { label: 'Thursday', value: 'thu' },
            { label: 'Friday', value: 'fri' },
            { label: 'Saturday', value: 'sat' },
          ],
        },
      ],
    },

    /** OPTIONAL META */
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
