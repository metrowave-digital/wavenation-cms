import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const Events: CollectionConfig = {
  slug: 'events',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'location', 'type'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor', 'host-dj']),
    update: allowAdminsAnd(['editor', 'host-dj']),
    delete: allowAdminsAnd(['admin']),
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Concert', value: 'concert' },
        { label: 'Radio Remote', value: 'remote' },
        { label: 'Community Event', value: 'community' },
        { label: 'Festival', value: 'festival' },
        { label: 'Virtual Event', value: 'virtual' },
        { label: 'Meet & Greet', value: 'meet' },
        { label: 'TV / Live Taping', value: 'taping' },
        { label: 'Special Broadcast', value: 'broadcast' },
      ],
    },

    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'description',
      type: 'richText',
    },

    /* DATE / TIME */
    { name: 'eventDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },

    /* LOCATION */
    { name: 'location', type: 'text' },

    {
      name: 'attachedProfiles',
      type: 'relationship',
      relationTo: ['profiles'],
      hasMany: true,
      admin: { description: 'Artists, DJs, speakers attending this event.' },
    },

    {
      name: 'attachedShows',
      type: 'relationship',
      relationTo: ['shows'],
      hasMany: true,
      admin: { description: 'Shows broadcasting live at this event.' },
    },

    {
      name: 'ticketsURL',
      type: 'text',
    },

    /* SEO */
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'keywords', type: 'textarea' },
      ],
    },
  ],
}
