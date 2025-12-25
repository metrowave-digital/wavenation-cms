// src/collections/EPGEntries.ts

import type { CollectionConfig } from 'payload'

import {
  isPublic,
  isEditorOrAbove,
  isStaffAccess,
  isAdmin,
  isStaffAccessField,
  isAdminField,
} from '@/access/control'

/* ============================================================
   COLLECTION
============================================================ */

export const EPGEntries: CollectionConfig = {
  slug: 'epg',

  labels: {
    singular: 'EPG Entry',
    plural: 'EPG Guide',
  },

  admin: {
    group: 'TV & Streaming',
    useAsTitle: 'title',
    defaultColumns: ['mode', 'contentType', 'title', 'start', 'end', 'channel'],
  },

  /* ------------------------------------------------------------
     ACCESS CONTROL
  ------------------------------------------------------------ */
  access: {
    read: isPublic,
    create: isEditorOrAbove,
    update: isStaffAccess,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    /* =========================================================
       MODE
    ========================================================= */
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

    /* =========================================================
       LINKED CONTENT
    ========================================================= */
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

    /* =========================================================
       MANUAL ENTRY
    ========================================================= */
    {
      name: 'manualTitle',
      type: 'text',
      admin: { condition: (data) => data?.mode === 'manual' },
    },

    {
      name: 'manualDescription',
      type: 'textarea',
      admin: { condition: (data) => data?.mode === 'manual' },
    },

    {
      name: 'manualThumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.mode === 'manual' },
    },

    /* =========================================================
       DISPLAY
    ========================================================= */
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display title (auto-filled for linked content if empty)',
      },
    },

    { name: 'subtitle', type: 'text' },

    /* =========================================================
       TIME WINDOW
    ========================================================= */
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

    /* =========================================================
       CHANNEL LANE
    ========================================================= */
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      admin: {
        description: 'Optional: Assign to a specific channel or lane',
      },
    },

    /* =========================================================
       RECURRENCE
    ========================================================= */
    {
      name: 'recurrence',
      type: 'group',
      admin: { description: 'Optional: Automatically repeat schedule' },
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

    /* =========================================================
       SORT + STATUS
    ========================================================= */
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      access: { update: isStaffAccessField },
      admin: {
        description: 'Lower numbers appear earlier in the grid',
      },
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      access: { update: isStaffAccessField },
      admin: {
        description: 'Disable to temporarily hide from live EPG',
      },
    },

    /* =========================================================
       METADATA
    ========================================================= */
    {
      name: 'metadata',
      type: 'json',
    },

    /* =========================================================
       AUDIT
    ========================================================= */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: isAdminField },
      admin: { readOnly: true, position: 'sidebar' },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: isAdminField },
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],

  /* ------------------------------------------------------------
     HOOKS
  ------------------------------------------------------------ */
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        /* ---------- audit ---------- */
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        /* ---------- time sanity ---------- */
        if (data.start && data.end && new Date(data.end) <= new Date(data.start)) {
          throw new Error('EPG end time must be after start time')
        }

        /* ---------- auto title (linked) ---------- */
        if (data.mode === 'linked' && data.content && !data.title) {
          data.title = 'Linked Program'
        }

        return data
      },
    ],
  },
}
