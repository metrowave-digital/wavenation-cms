// src/collections/Schedule.ts

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

export const Schedule: CollectionConfig = {
  slug: 'schedule',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'dayOfWeek', 'startTime', 'endTime', 'relatedShow'],
    group: 'Content',
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
       CORE DETAILS
    ========================================================= */
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: "Name of the scheduled block (e.g. 'Morning Flow', 'Prime Time TV').",
      },
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* =========================================================
       DAY + TIME
    ========================================================= */
    {
      name: 'dayOfWeek',
      type: 'select',
      hasMany: true,
      required: true,
      options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
        (d) => ({ label: d, value: d.toLowerCase() }),
      ),
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'HH:MM format (24h recommended)',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'HH:MM format (24h recommended)',
          },
        },
      ],
    },

    {
      name: 'timeZone',
      type: 'text',
      defaultValue: 'America/New_York',
      admin: {
        description: 'IANA timezone used for EPG + live grids',
      },
    },

    /* =========================================================
       RELATIONSHIPS
    ========================================================= */
    {
      name: 'relatedShow',
      type: 'relationship',
      relationTo: 'shows',
      admin: {
        description: 'Attach to a radio or TV show',
      },
    },

    {
      name: 'relatedEpisode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: {
        description: 'Optional — specific episode scheduled',
      },
    },

    /* =========================================================
       SORTING + STATUS (FUTURE SAFE)
    ========================================================= */
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      access: {
        update: isStaffAccessField,
      },
      admin: {
        description: 'Lower numbers appear earlier in the schedule',
      },
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      access: {
        update: isStaffAccessField,
      },
      admin: {
        description: 'Disable to temporarily remove from live rotation',
      },
    },

    /* =========================================================
       AUDIT (LOCKED)
    ========================================================= */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: isAdminField },
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: isAdminField },
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],

  /* ------------------------------------------------------------
     HOOKS
  ------------------------------------------------------------ */
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        return data
      },
    ],
  },
}
