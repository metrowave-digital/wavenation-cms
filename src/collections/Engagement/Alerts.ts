// src/collections/engagement/Alerts.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Alerts: CollectionConfig = {
  slug: 'alerts',

  admin: {
    group: 'Engagement',
    useAsTitle: 'title',
    defaultColumns: ['title', 'severity', 'active', 'startsAt', 'endsAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (RBAC SAFE)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Public frontend (API key + fetch code)
     * - Logged-in users (admin UI & authenticated apps)
     */
    read: AccessControl.isPublic,

    /**
     * CREATE
     * - Staff+
     * - Admin override applies
     */
    create: AccessControl.isStaffAccess,

    /**
     * UPDATE
     * - Staff+
     * - Admin override applies
     */
    update: AccessControl.isStaffAccess,

    /**
     * DELETE
     * - Admin only (destructive)
     */
    delete: AccessControl.isAdmin,
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'message',
      type: 'textarea',
      required: true,
    },

    {
      name: 'severity',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' },
      ],
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}

export default Alerts
