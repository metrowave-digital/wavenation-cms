import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const Announcements: CollectionConfig = {
  slug: 'announcements',

  labels: {
    singular: 'Announcement',
    plural: 'Announcements',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'priority', 'startsAt', 'endsAt'],
  },

  access: {
    read: () => true,
    create: allowRoles(['editor', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: allowRoles(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Breaking News', value: 'breaking' },
        { label: 'On-Air Update', value: 'on-air' },
        { label: 'Programming Alert', value: 'programming' },
        { label: 'Event Announcement', value: 'event' },
        { label: 'Emergency', value: 'emergency' },
      ],
    },

    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },

    {
      name: 'message',
      type: 'textarea',
      required: true,
    },

    /* CONNECTIONS */
    {
      name: 'relatedHosts',
      type: 'relationship',
      relationTo: 'dj-hosts',
      hasMany: true,
      admin: { description: 'Hosts delivering this announcement.' },
    },

    {
      name: 'relatedShows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
    },

    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },

    /* AVAILABILITY WINDOW */
    {
      name: 'startsAt',
      type: 'date',
      required: true,
    },
    {
      name: 'endsAt',
      type: 'date',
      required: true,
    },

    /* STATUS */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Draft', value: 'draft' },
      ],
    },

    /* MEDIA */
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    /* SEO */
    SEOFields,
  ],
}

export default Announcements
