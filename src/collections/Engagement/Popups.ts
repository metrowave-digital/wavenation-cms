// src/collections/Engagement/Popups.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Popups: CollectionConfig = {
  slug: 'popups',

  admin: {
    group: 'Engagement',
    useAsTitle: 'title',
    defaultColumns: ['title', 'trigger', 'active', 'startsAt', 'endsAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (CAMPAIGN SAFE)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Public frontend (API key + fetch code)
     * - Logged-in users (admin UI, internal apps)
     */
    read: AccessControl.isPublic,

    /**
     * CREATE
     * - Admin / System only
     */
    create: AccessControl.isAdmin,

    /**
     * UPDATE
     * - Admin / System only
     */
    update: AccessControl.isAdmin,

    /**
     * DELETE
     * - Admin / System only
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
      name: 'content',
      type: 'richText',
      required: true,
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'location',
      type: 'select',
      defaultValue: 'global',
      options: [
        { label: 'Global', value: 'global' },
        { label: 'Home', value: 'home' },
        { label: 'Radio', value: 'radio' },
        { label: 'TV / Plus', value: 'tv' },
        { label: 'Creators', value: 'creators' },
        { label: 'Events', value: 'events' },
      ],
    },

    {
      name: 'trigger',
      type: 'select',
      defaultValue: 'on_load',
      options: [
        { label: 'On Load', value: 'on_load' },
        { label: 'Delay', value: 'delay' },
        { label: 'Scroll', value: 'scroll' },
        { label: 'Exit Intent', value: 'exit' },
        { label: 'Logged Out Only', value: 'logged_out' },
        { label: 'Logged In Only', value: 'logged_in' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'delayMs',
          type: 'number',
          admin: { width: '33%' },
        },
        {
          name: 'scrollPercent',
          type: 'number',
          admin: { width: '33%' },
        },
        {
          name: 'showOncePerSession',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%' },
        },
      ],
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
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    /* ---------------------------------------------------------
       AUDIT
    --------------------------------------------------------- */
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

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
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

export default Popups
