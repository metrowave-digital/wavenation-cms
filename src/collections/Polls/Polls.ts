// src/collections/Polls.ts
import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Polls: CollectionConfig = {
  slug: 'polls',

  admin: {
    useAsTitle: 'question',
    group: 'Engagement',
    defaultColumns: ['question', 'status', 'scope', 'startAt', 'endAt'],
  },

  /* -----------------------------------------------------------
     ACCESS (ENTERPRISE SAFE — SAME BEHAVIOR)
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,
    create: AccessControl.isLoggedIn,
    update: AccessControl.isLoggedIn,
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ======================================================
           TAB 1 — CORE POLL
        ====================================================== */
        {
          label: 'Poll',
          fields: [
            { name: 'question', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              admin: { description: 'Auto-generated if empty' },
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Active', value: 'active' },
                { label: 'Closed', value: 'closed' },
                { label: 'Archived', value: 'archived' },
              ],
            },

            {
              name: 'scope',
              type: 'select',
              required: true,
              defaultValue: 'global',
              options: [
                { label: 'Global (Site-wide)', value: 'global' },
                { label: 'Content-Specific', value: 'content' },
                { label: 'Event / Ticketing', value: 'event' },
                { label: 'Channel', value: 'channel' },
              ],
            },
          ],
        },

        /* ======================================================
           TAB 2 — OPTIONS
        ====================================================== */
        {
          label: 'Options',
          fields: [
            {
              name: 'options',
              type: 'array',
              required: true,
              labels: { singular: 'Option', plural: 'Options' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
                {
                  name: 'voteCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

        /* ======================================================
           TAB 3 — TARGETING
        ====================================================== */
        {
          label: 'Targeting',
          fields: [
            {
              name: 'targetContentType',
              type: 'select',
              admin: {
                condition: (data) => data?.scope === 'content',
                description: 'If content-specific, choose content type.',
              },
              options: [
                'shows',
                'episodes',
                'films',
                'vod',
                'podcasts',
                'podcast-episodes',
                'articles',
                'tracks',
                'albums',
              ].map((v) => ({ label: v, value: v })),
            },

            {
              name: 'targetContent',
              type: 'relationship',
              relationTo: [
                'shows',
                'episodes',
                'films',
                'vod',
                'podcasts',
                'podcast-episodes',
                'articles',
                'tracks',
                'albums',
              ],
              admin: { condition: (data) => data?.scope === 'content' },
            },

            {
              name: 'targetEvent',
              type: 'relationship',
              relationTo: 'events',
              admin: { condition: (data) => data?.scope === 'event' },
            },

            {
              name: 'targetChannel',
              type: 'relationship',
              relationTo: 'creator-channels',
              admin: { condition: (data) => data?.scope === 'channel' },
            },
          ],
        },

        /* ======================================================
           TAB 4 — AUDIENCE RULES
        ====================================================== */
        {
          label: 'Audience',
          fields: [
            {
              name: 'audienceRoles',
              type: 'select',
              hasMany: true,
              admin: { description: 'Limit poll to certain roles (optional)' },
              options: ['free', 'creator', 'pro', 'industry', 'host', 'editor', 'admin'].map(
                (v) => ({ label: v, value: v }),
              ),
            },

            {
              name: 'requireAuth',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Require logged-in user to vote' },
            },

            {
              name: 'allowMultipleVotes',
              type: 'checkbox',
              defaultValue: false,
            },

            {
              name: 'showResults',
              type: 'select',
              defaultValue: 'after-vote',
              options: [
                { label: 'Always', value: 'always' },
                { label: 'After Vote', value: 'after-vote' },
                { label: 'After Poll Ends', value: 'after-end' },
                { label: 'Never (Admin Only)', value: 'admin-only' },
              ],
            },
          ],
        },

        /* ======================================================
           TAB 5 — TIMING
        ====================================================== */
        {
          label: 'Timing',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'startAt', type: 'date', admin: { width: '50%' } },
                { name: 'endAt', type: 'date', admin: { width: '50%' } },
              ],
            },
          ],
        },

        /* ======================================================
           TAB 6 — ANALYTICS
        ====================================================== */
        {
          label: 'Analytics',
          fields: [
            {
              name: 'totalVotes',
              type: 'number',
              defaultValue: 0,
              admin: { readOnly: true },
            },
            {
              name: 'metadata',
              type: 'json',
            },
          ],
        },

        /* ======================================================
           TAB 7 — SYSTEM
        ====================================================== */
        {
          label: 'System',
          fields: [
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
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Slug generation
        if (data.question && !data.slug) {
          data.slug = data.question
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        // Audit fields
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // Auto-close expired polls
        if (data.endAt && new Date(data.endAt) < new Date()) {
          data.status = 'closed'
        }

        return data
      },
    ],
  },
}

export default Polls
