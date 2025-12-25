// src/collections/Events/Events.ts

import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

export const Events: CollectionConfig = {
  slug: 'events',

  admin: {
    useAsTitle: 'title',
    group: 'Events',
    defaultColumns: ['title', 'eventType', 'status', 'startDateTime'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (PAYLOAD-SAFE)
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,

    create: ({ req }) => AccessControl.hasRoleAtOrAbove(req, Roles.STAFF),

    update: ({ req, data }) => AccessControl.canEditEvent(req, data),

    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* =============================
           TAB — Details
        ============================== */
        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                description: 'Auto-generated from title if empty.',
              },
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              access: {
                update: AccessControl.canPublishEventField,
              },
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Completed', value: 'completed' },
              ],
            },

            {
              name: 'visibility',
              type: 'select',
              defaultValue: 'public',
              options: [
                { label: 'Public', value: 'public' },
                { label: 'Unlisted', value: 'unlisted' },
                { label: 'Private', value: 'private' },
              ],
            },

            {
              name: 'eventType',
              type: 'select',
              required: true,
              defaultValue: 'live-show',
              options: [
                { label: 'Concert / Live Show', value: 'live-show' },
                { label: 'Festival', value: 'festival' },
                { label: 'Film Screening', value: 'film-screening' },
                { label: 'Podcast Taping', value: 'podcast-taping' },
                { label: 'Listening Party', value: 'listening-party' },
                { label: 'Workshop / Class', value: 'workshop' },
                { label: 'Conference', value: 'conference' },
                { label: 'Church Service', value: 'service' },
                { label: 'Meetup / Mixer', value: 'meetup' },
                { label: 'Virtual / Online', value: 'virtual' },
                { label: 'Other', value: 'other' },
              ],
            },

            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
            },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        /* =============================
           TAB — Schedule
        ============================== */
        {
          label: 'Schedule',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startDateTime',
                  type: 'date',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'endDateTime',
                  type: 'date',
                  admin: { width: '50%' },
                },
              ],
            },

            {
              name: 'timezone',
              type: 'text',
              admin: {
                description: 'IANA timezone (e.g. America/New_York).',
              },
            },

            { name: 'doorsOpenAt', type: 'date' },

            {
              name: 'scheduleBlocks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'start', type: 'date', required: true, admin: { width: '50%' } },
                    { name: 'end', type: 'date', admin: { width: '50%' } },
                  ],
                },
                { name: 'description', type: 'textarea' },
              ],
            },
          ],
        },

        /* =============================
           TAB — Venue
        ============================== */
        {
          label: 'Venue',
          fields: [
            { name: 'isOnline', type: 'checkbox', defaultValue: false },

            {
              name: 'venue',
              type: 'relationship',
              relationTo: 'venues',
              admin: { condition: (d) => !d?.isOnline },
            },

            {
              name: 'customLocation',
              type: 'text',
              admin: { condition: (d) => !d?.isOnline },
            },

            {
              name: 'streamUrl',
              type: 'text',
              admin: { condition: (d) => d?.isOnline },
            },
          ],
        },

        /* =============================
           TAB — Ticketing
        ============================== */
        {
          label: 'Ticketing',
          fields: [
            { name: 'ticketingEnabled', type: 'checkbox', defaultValue: true },

            {
              name: 'ticketProvider',
              type: 'select',
              defaultValue: 'internal',
              options: [
                { label: 'WaveNation Internal', value: 'internal' },
                { label: 'External', value: 'external' },
              ],
            },

            {
              name: 'externalTicketUrl',
              type: 'text',
              admin: { condition: (d) => d?.ticketProvider === 'external' },
            },

            {
              type: 'row',
              fields: [
                { name: 'capacity', type: 'number', admin: { width: '33%' } },
                {
                  name: 'ticketsSold',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '33%' },
                },
                {
                  name: 'ticketsAvailable',
                  type: 'number',
                  admin: { readOnly: true, width: '33%' },
                },
              ],
            },

            {
              name: 'ticketTypes',
              type: 'relationship',
              relationTo: 'ticket-types',
              hasMany: true,
            },
          ],
        },

        /* =============================
           TAB — Media
        ============================== */
        {
          label: 'Media',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
            { name: 'promoVideo', type: 'upload', relationTo: 'media' },
            { name: 'brandColor', type: 'text' },
          ],
        },

        /* =============================
           TAB — People & Relationships
        ============================== */
        {
          label: 'People & Relationships',
          fields: [
            { name: 'organizers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'hosts', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'performers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'groups', type: 'relationship', relationTo: 'groups', hasMany: true },
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
            },
            { name: 'relatedShows', type: 'relationship', relationTo: 'shows', hasMany: true },
          ],
        },

        /* =============================
           TAB — Taxonomy
        ============================== */
        {
          label: 'Taxonomy',
          fields: [
            { name: 'category', type: 'relationship', relationTo: 'categories' },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
          ],
        },

        /* =============================
           TAB — SEO
        ============================== */
        { label: 'SEO', fields: [seoFields] },

        /* =============================
           TAB — Analytics
        ============================== */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'views',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: AccessControl.metricsFieldUpdate },
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'clicks',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: AccessControl.metricsFieldUpdate },
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'conversions',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: AccessControl.metricsFieldUpdate },
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'grossRevenue',
                  type: 'number',
                  defaultValue: 0,
                  access: { update: AccessControl.metricsFieldUpdate },
                  admin: { readOnly: true, width: '25%' },
                },
              ],
            },
          ],
        },

        /* =============================
           TAB — System
        ============================== */
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

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (data?.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        if (typeof data.capacity === 'number' && typeof data.ticketsSold === 'number') {
          data.ticketsAvailable = Math.max(data.capacity - data.ticketsSold, 0)
        }

        if (data?.startDateTime && data?.endDateTime) {
          const now = new Date()
          if (new Date(data.endDateTime) < now && data.status === 'published') {
            data.status = 'completed'
          }
        }

        if (data.status === 'cancelled') {
          data.ticketingEnabled = false
        }

        return data
      },
    ],
  },
}

export default Events
