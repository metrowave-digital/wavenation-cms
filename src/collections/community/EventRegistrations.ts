import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',

  labels: {
    singular: 'Event Registration',
    plural: 'Event Registrations',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Events & Tickets',
    defaultColumns: ['event', 'user', 'status', 'createdAt'],
  },

  access: {
    // Local API (from your own Next API routes) bypasses this,
    // but it's still good to lock down the REST / GraphQL surface.
    read: ({ req }) => !!req.user, // logged-in users only
    create: ({ req }) => !!req.user || allowRoles(['admin'])({ req }),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: ['events', 'live-events'],
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'registered',
      options: [
        { label: 'Registered', value: 'registered' },
        { label: 'Canceled', value: 'canceled' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'web',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'On-site', value: 'onsite' },
        { label: 'Imported', value: 'import' },
      ],
    },

    {
      name: 'qrCode',
      type: 'text',
      admin: { description: 'Encoded QR payload' },
    },
  ],
}

export default EventRegistrations
