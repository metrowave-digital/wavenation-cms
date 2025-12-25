import type { CollectionConfig, Access } from 'payload'

import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Moderation jobs are SYSTEM-LEVEL records.
 *
 * Allowed:
 * - Staff
 * - Admin
 * - System
 *
 * Blocked:
 * - Creators
 * - Moderators
 * - Public
 */
const staffOnly: Access = ({ req }) =>
  Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)))

/* ============================================================
   COLLECTION
============================================================ */

export const ModerationJobs: CollectionConfig = {
  slug: 'moderation-jobs',

  admin: {
    group: 'System',
    useAsTitle: 'id',
    defaultColumns: ['collection', 'docId', 'status', 'attempts', 'runAt'],
  },

  access: {
    read: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       TARGET
    -------------------------------------------------------- */
    {
      name: 'collection',
      type: 'text',
      required: true,
    },
    {
      name: 'docId',
      type: 'text',
      required: true,
      index: true,
    },

    /* --------------------------------------------------------
       STATE
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'queued',
      options: [
        { label: 'Queued', value: 'queued' },
        { label: 'Processing', value: 'processing' },
        { label: 'Done', value: 'done' },
        { label: 'Error', value: 'error' },
      ],
    },

    {
      name: 'runAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When this job becomes eligible to run.',
      },
    },

    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
    },

    {
      name: 'lastError',
      type: 'textarea',
    },

    /* --------------------------------------------------------
       AUDIT
    -------------------------------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req?.user) return data

        if (operation === 'create') {
          data.createdBy = String(req.user.id)
        }

        return data
      },
    ],
  },
}

export default ModerationJobs
