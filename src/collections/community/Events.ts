import type { CollectionConfig } from 'payload'
import { publicRead, isEditor, isHostDJ, isAdmin } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Events: CollectionConfig = {
  slug: 'events',

  labels: {
    singular: 'Event',
    plural: 'Events',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Programming',
    defaultColumns: ['title', 'eventDate', 'location', 'type', 'staffPick', 'featuredPriority'],
  },

  access: {
    read: publicRead,
    create: ({ req }) => isEditor({ req }) || isHostDJ({ req }),
    update: ({ req }) => isEditor({ req }) || isHostDJ({ req }),
    delete: isAdmin,
  },

  fields: [
    /* ------------------------------------------------------
     * BASIC INFO
     * ------------------------------------------------------ */
    { name: 'title', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        description: 'Auto-generated URL slug',
      },
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      admin: { description: 'What type of event is this?' },
      options: [
        { label: 'Concert', value: 'concert' },
        { label: 'Radio Remote', value: 'remote' },
        { label: 'Community Event', value: 'community' },
        { label: 'Festival', value: 'festival' },
        { label: 'Virtual Event', value: 'virtual' },
        { label: 'Meet & Greet', value: 'meet' },
        { label: 'TV / Live Taping', value: 'taping' },
        { label: 'Special Broadcast', value: 'broadcast' },
        { label: 'Conference / Workshop', value: 'conference' },
        { label: 'Competition / Pageant', value: 'pageant' },
      ],
    },

    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },

    { name: 'description', type: 'richText' },

    /* ------------------------------------------------------
     * DATE / TIME
     * ------------------------------------------------------ */
    { name: 'eventDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },

    /* ------------------------------------------------------
     * LOCATION
     * ------------------------------------------------------ */
    { name: 'location', type: 'text' },

    /* ------------------------------------------------------
     * ATTACHED TALENT / PROFILES / SHOWS
     * ------------------------------------------------------ */
    {
      name: 'attachedProfiles',
      type: 'relationship',
      relationTo: ['profiles'],
      hasMany: true,
      admin: { description: 'Artists, DJs, speakers, special guests.' },
    },

    {
      name: 'attachedTalent',
      type: 'relationship',
      relationTo: 'talent',
      hasMany: true,
      admin: { description: 'Hosts, MCs, reporters, DJs, commentators.' },
    },

    {
      name: 'attachedShows',
      type: 'relationship',
      relationTo: ['shows'],
      hasMany: true,
      admin: { description: 'Shows broadcasting live at this event.' },
    },

    /* ------------------------------------------------------
     * TICKETS & LINKS
     * ------------------------------------------------------ */
    { name: 'ticketsURL', type: 'text' },
    { name: 'liveStreamURL', type: 'text' },
    { name: 'rsvpURL', type: 'text' },

    /* ------------------------------------------------------
     * REGISTRATIONS / CHECK-INS (inverse)
     * ------------------------------------------------------ */
    {
      name: 'registrations',
      type: 'relationship',
      relationTo: 'event-registrations',
      hasMany: true,
      admin: {
        description: 'Registrations associated with this event.',
      },
    },
    {
      name: 'checkins',
      type: 'relationship',
      relationTo: 'event-checkins',
      hasMany: true,
      admin: {
        description: 'Check-ins at the event.',
      },
    },

    /* ------------------------------------------------------
     * ANALYTICS (AlgorithmSettings.events)
     * ------------------------------------------------------ */
    {
      name: 'metrics',
      type: 'group',
      admin: { description: 'Internal analytics used for ranking.' },
      fields: [
        {
          name: 'rsvpCount',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'ticketSales',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'popularityScore',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Internal event popularity ranking.' },
        },
        {
          name: 'relevanceScore',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'recentnessScore',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'typePriority',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Boosts certain event types in feeds.' },
        },
      ],
    },

    /* ------------------------------------------------------
     * DISCOVERY / PROMOTION
     * ------------------------------------------------------ */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Featured by programming or editorial team.' },
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher value = more visibility across apps.',
      },
    },

    /* ------------------------------------------------------
     * SEO
     * ------------------------------------------------------ */

    SEOFields,
  ],
}

export default Events
