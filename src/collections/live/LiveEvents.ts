import type { CollectionConfig } from 'payload'
import { allowRoles, publicRead } from '@/access/control'
import { SEOFields } from '@/fields'

export const LiveEvents: CollectionConfig = {
  slug: 'live-events',

  labels: {
    singular: 'Live Event',
    plural: 'Live Events',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Events & Tickets',
    defaultColumns: ['title', 'eventType', 'status', 'startDate', 'venue'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    /* -------------------------------------------
     * BASIC INFO
     * ------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        description: 'Auto-generated URL slug (optional hook).',
      },
    },

    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Concert', value: 'concert' },
        { label: 'Award Show', value: 'award-show' },
        { label: 'Festival Event', value: 'festival' },
        { label: 'Workshop / Masterclass', value: 'workshop' },
        { label: 'Panel / Talk', value: 'panel' },
        { label: 'Showcase / Performance', value: 'showcase' },
        { label: 'Film Screening', value: 'screening' },
        { label: 'Afterparty', value: 'afterparty' },
        { label: 'Livestream', value: 'livestream' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Completed', value: 'completed' },
      ],
    },

    /* -------------------------------------------
     * SCHEDULING
     * ------------------------------------------- */
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: false,
    },
    {
      name: 'doorsOpen',
      type: 'date',
      required: false,
    },

    /* -------------------------------------------
     * LOCATION
     * ------------------------------------------- */
    {
      name: 'venue',
      type: 'text',
      required: true,
    },

    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'zip', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'USA' },
      ],
    },

    /* -------------------------------------------
     * TICKETING
     * ------------------------------------------- */
    {
      name: 'ticketingEnabled',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'ticketTypes',
      type: 'array',
      admin: {
        condition: (data) => data.ticketingEnabled === true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    /* -------------------------------------------
     * VISUALS & MEDIA
     * ------------------------------------------- */
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },

    {
      name: 'videoTrailer',
      type: 'upload',
      relationTo: 'media',
    },

    /* -------------------------------------------
     * PROMOTION & METADATA
     * ------------------------------------------- */
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },

    {
      name: 'description',
      type: 'richText',
    },

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },

    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },

    SEOFields,

    /* -------------------------------------------
     * INTERNAL FIELDS
     * ------------------------------------------- */
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Private notes for internal team.',
      },
      access: {
        read: ({ req }) => !!req.user && ['admin', 'editor'].includes(req.user.role),
        update: ({ req }) => !!req.user && ['admin', 'editor'].includes(req.user.role),
      },
    },
  ],
}
