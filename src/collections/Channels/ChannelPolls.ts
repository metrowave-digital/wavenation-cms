// src/collections/ChannelPolls.ts
import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const ChannelPolls: CollectionConfig = {
  slug: 'channel-polls',

  admin: {
    useAsTitle: 'question',
    group: 'Creator Channels',
    defaultColumns: ['question', 'channel', 'status', 'visibility', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE SAFE)
     - Read: public / API locked
     - Create: channel owner / moderator / staff
     - Update:
         • draft/active: channel owner / moderator / staff
         • closed: staff/admin only
     - Delete: admin only
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: ({ req, data }) =>
      AccessControl.canEditChannel(req, {
        creator: data?.channel,
      }),

    update: ({ req, data }) => {
      // Closed polls are immutable except for staff/admin
      if (data?.status === 'closed') {
        return AccessControl.hasRoleAtOrAbove(req, 'staff' as any)
      }

      return AccessControl.canEditChannel(req, {
        creator: data?.channel,
      })
    },

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
        description: 'Channel that owns this poll',
      },
    },

    /* ================= QUESTION ================= */
    {
      name: 'question',
      type: 'text',
      required: true,
    },

    /* ================= STATUS ================= */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        description: 'Once a poll is closed, options and results become immutable.',
      },
      access: {
        update: AccessControl.isStaffAccessField, // prevent creators reopening polls
      },
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
        description: 'Poll audience gate. Tiered visibility is staff-controlled.',
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
        description: 'Which tiers may participate in this poll',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= OPTIONS ================= */
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      labels: { singular: 'Option', plural: 'Options' },
      admin: {
        description: 'Poll answer options (immutable once poll is active)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'voteCount',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
          access: {
            update: () => false, // votes only via endpoint
          },
        },
      ],
    },

    /* ================= RESULTS (READ-ONLY ANALYTICS) ================= */
    {
      name: 'results',
      type: 'group',
      admin: {
        description: 'Aggregated metrics for analytics & dashboards.',
      },
      access: {
        update: AccessControl.isStaffAccessField, // workers / staff only
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalVotes',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'uniqueVoters',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'participationRate',
              type: 'number',
              admin: {
                width: '33%',
                description: '0–1 fraction of eligible viewers',
              },
            },
          ],
        },
        {
          name: 'byTier',
          type: 'json',
          admin: { description: 'Breakdown of votes by creator tier.' },
        },
        {
          name: 'byGeo',
          type: 'json',
          admin: { description: 'Optional breakdown by geography.' },
        },
        {
          name: 'byDevice',
          type: 'json',
          admin: { description: 'Optional breakdown by device (mobile, web, tv).' },
        },
      ],
    },

    /* ================= SCHEDULING ================= */
    {
      type: 'row',
      fields: [
        {
          name: 'startAt',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'endAt',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    /* ================= RESULTS VISIBILITY ================= */
    {
      name: 'showResults',
      type: 'select',
      defaultValue: 'after-vote',
      options: [
        { label: 'Always', value: 'always' },
        { label: 'After Vote', value: 'after-vote' },
        { label: 'After Poll Ends', value: 'after-end' },
      ],
    },
  ],

  /* -----------------------------------------------------------
     HOOKS (ENTERPRISE SAFE)
  ----------------------------------------------------------- */
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Ensure poll has at least two options
        if (!Array.isArray(data?.options) || data.options.length < 2) {
          throw new Error('Polls must have at least two options.')
        }

        return data
      },
    ],
  },
}

export default ChannelPolls
