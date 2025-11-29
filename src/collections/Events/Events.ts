import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/* ============================================================
   ACCESS CONTROL — fully typed for Payload v3
============================================================ */

const isAdmin = ({ req }: { req: import('payload').PayloadRequest }) => {
  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  return roles.includes('admin') || roles.includes('super-admin')
}

/* ============================================================
   COLLECTION — Events
============================================================ */

export const Events: CollectionConfig = {
  slug: 'events',

  admin: {
    useAsTitle: 'title',
    group: 'Events',
    defaultColumns: ['title', 'eventType', 'status', 'startDateTime'],
  },

  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Completed', value: 'completed' },
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
              admin: {
                description: 'Detailed description using Lexical editor.',
              },
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

            {
              name: 'doorsOpenAt',
              type: 'date',
            },

            {
              name: 'scheduleBlocks',
              type: 'array',
              labels: {
                singular: 'Block',
                plural: 'Blocks',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'start',
                      type: 'date',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'end',
                      type: 'date',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
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
              admin: { condition: (data) => !data?.isOnline },
            },

            {
              name: 'customLocation',
              type: 'text',
              admin: {
                condition: (data) => !data?.isOnline,
                description: 'Enter location manually if not using a Venue.',
              },
            },

            {
              name: 'streamUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.isOnline,
                description: 'URL for virtual events.',
              },
            },
          ],
        },

        /* =============================
           TAB — Ticketing
        ============================== */
        {
          label: 'Ticketing',
          fields: [
            {
              name: 'ticketingEnabled',
              type: 'checkbox',
              defaultValue: true,
            },

            {
              name: 'ticketProvider',
              type: 'select',
              defaultValue: 'internal',
              options: [
                { label: 'WaveNation Internal', value: 'internal' },
                { label: 'External (Eventbrite, Ticketmaster)', value: 'external' },
              ],
            },

            {
              name: 'externalTicketUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.ticketProvider === 'external',
              },
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'capacity',
                  type: 'number',
                  admin: {
                    width: '33%',
                    description: 'Max attendee capacity.',
                  },
                },
                {
                  name: 'ticketsSold',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    width: '33%',
                    readOnly: true,
                  },
                },
                {
                  name: 'ticketsAvailable',
                  type: 'number',
                  admin: {
                    width: '33%',
                    readOnly: true,
                  },
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
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
            },
            { name: 'promoVideo', type: 'upload', relationTo: 'media' },
            { name: 'brandColor', type: 'text' },
          ],
        },

        /* =============================
           TAB — Relationships
        ============================== */
        {
          label: 'People & Relationships',
          fields: [
            {
              name: 'organizers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'hosts',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'performers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'groups',
              type: 'relationship',
              relationTo: 'groups',
              hasMany: true,
            },
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
            },
            {
              name: 'relatedShows',
              type: 'relationship',
              relationTo: 'shows',
              hasMany: true,
            },
          ],
        },

        /* =============================
           TAB — Taxonomy
        ============================== */
        {
          label: 'Taxonomy',
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
          ],
        },

        /* =============================
           TAB — SEO
        ============================== */
        {
          label: 'SEO',
          fields: [seoFields],
        },

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
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'clicks',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'conversions',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'grossRevenue',
                  type: 'number',
                  defaultValue: 0,
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

  /* ============================================================
     HOOKS — fully typed
  ============================================================ */
  hooks: {
    beforeChange: [
      ({
        data,
        req,
        operation,
      }: {
        data: any
        req: import('payload').PayloadRequest
        operation: 'create' | 'update'
      }) => {
        // Track creator / editor
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }

        // Auto-slug
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        // Auto-calc ticketsAvailable
        if (typeof data.capacity === 'number' && typeof data.ticketsSold === 'number') {
          data.ticketsAvailable = Math.max(data.capacity - data.ticketsSold, 0)
        }

        return data
      },
    ],
  },
}
