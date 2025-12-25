// src/collections/PollVotes.ts
import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',

  admin: {
    useAsTitle: 'pollDisplay',
    group: 'Engagement',
    defaultColumns: ['poll', 'optionLabel', 'user', 'ip', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS (WRITE-HEAVY, READ-SENSITIVE)
     ⚠️ Behavior unchanged
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Public users: allowed (aggregation layer should be used)
     * - Admins: full visibility
     */
    read: AccessControl.isPublic,

    /**
     * CREATE
     * - Anyone can submit a vote
     * - Enforcement happens at API / hook level
     */
    create: () => true,

    /**
     * UPDATE
     * - Votes are immutable
     */
    update: () => false,

    /**
     * DELETE
     * - Admin only (moderation / cleanup)
     */
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ======================================================
           TAB 1 — VOTE CORE
        ====================================================== */
        {
          label: 'Vote',
          fields: [
            {
              name: 'poll',
              type: 'relationship',
              relationTo: 'polls',
              required: true,
            },

            {
              name: 'optionValue',
              type: 'number',
              required: true,
            },

            {
              name: 'optionLabel',
              type: 'text',
              required: true,
            },
          ],
        },

        /* ======================================================
           TAB 2 — USER / IDENTITY
        ====================================================== */
        {
          label: 'Identity',
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: false,
            },

            {
              name: 'ip',
              type: 'text',
              required: true,
            },

            {
              name: 'userAgent',
              type: 'text',
              required: false,
            },
          ],
        },

        /* ======================================================
           TAB 3 — TARGETING CONTEXT
        ====================================================== */
        {
          label: 'Targeting',
          fields: [
            {
              name: 'targetContentType',
              type: 'text',
              required: false,
            },

            {
              name: 'targetContentId',
              type: 'text',
              required: false,
            },
          ],
        },

        /* ======================================================
           TAB 4 — SYSTEM
        ====================================================== */
        {
          label: 'System',
          fields: [
            {
              name: 'pollDisplay',
              type: 'text',
              admin: { readOnly: true },
              hooks: {
                beforeChange: [
                  ({ data }) => {
                    if (data?.poll && data?.optionLabel) {
                      data.pollDisplay = `Poll ${data.poll} — ${data.optionLabel}`
                    }
                    return data
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}

export default PollVotes
