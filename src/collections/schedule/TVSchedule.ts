import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin, publicRead } from '@/access/control'

export const TVSchedule: CollectionConfig = {
  slug: 'tv-schedule',

  labels: {
    singular: 'TV Schedule Block',
    plural: 'TV Schedule',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Programming',
    defaultColumns: [
      'title',
      'dayOfWeek',
      'startTime',
      'endTime',
      'programType',
      'show',
      'episode',
    ],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: isAdmin,
  },

  fields: [
    /* -------------------------------------
     * BASIC INFO
     * ------------------------------------- */
    { name: 'title', type: 'text', required: true },

    {
      name: 'programType',
      type: 'select',
      required: true,
      defaultValue: 'show',
      options: [
        { label: 'Show', value: 'show' },
        { label: 'Specific Episode', value: 'episode' },
        { label: 'Playlist / Music Block', value: 'playlist' },
        { label: 'Special Event', value: 'event' },
        { label: 'Live Broadcast', value: 'live' },
      ],
    },

    /* -------------------------------------
     * TIME & DAY
     * ------------------------------------- */
    {
      name: 'dayOfWeek',
      type: 'select',
      required: true,
      options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
        (d) => ({
          label: d[0].toUpperCase() + d.slice(1),
          value: d,
        }),
      ),
    },

    {
      name: 'startTime',
      type: 'text',
      required: true,
      admin: { description: '24h format, e.g. 20:00' },
    },

    {
      name: 'endTime',
      type: 'text',
      required: true,
      admin: { description: '24h format, e.g. 21:00' },
    },

    /* -------------------------------------
     * PROGRAM SOURCES
     * ------------------------------------- */
    {
      name: 'show',
      type: 'relationship',
      relationTo: 'shows',
      admin: {
        condition: (_, sibling) => sibling.programType === 'show' || sibling.programType === 'live',
      },
    },

    {
      name: 'episode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: {
        description: 'Schedule a specific episode.',
        condition: (_, sibling) => sibling.programType === 'episode',
      },
    },

    {
      name: 'playlist',
      type: 'relationship',
      relationTo: 'playlists',
      admin: {
        description: 'Music or ambient content block.',
        condition: (_, sibling) => sibling.programType === 'playlist',
      },
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: 'Special live event / premiere.',
        condition: (_, sibling) => sibling.programType === 'event',
      },
    },

    /* -------------------------------------
     * AVAILABILITY WINDOWS (OTT / TV Platforms)
     * ------------------------------------- */
    {
      name: 'availability',
      type: 'group',
      label: 'Availability Window',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },
        {
          name: 'countryRestrictions',
          type: 'array',
          fields: [{ name: 'country', type: 'text' }],
        },
        {
          name: 'platformAvailability',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile App', value: 'mobile' },
            { label: 'Apple TV', value: 'apple_tv' },
            { label: 'Roku', value: 'roku' },
            { label: 'Fire TV', value: 'fire_tv' },
          ],
        },
      ],
    },

    /* -------------------------------------
     * AGE RATING FOR THE BLOCK
     * Useful for late-night content, adult programming blocks
     * ------------------------------------- */
    {
      name: 'ageRating',
      type: 'group',
      label: 'Age Rating',
      fields: [
        {
          name: 'tvRating',
          type: 'select',
          admin: { description: 'TV Parental Guidelines rating' },
          options: ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'].map((r) => ({
            label: r,
            value: r,
          })),
        },
        {
          name: 'movieRating',
          type: 'select',
          admin: { description: 'MPAA rating (if applicable)' },
          options: ['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => ({ label: r, value: r })),
        },
        {
          name: 'contentWarnings',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Violence', value: 'violence' },
            { label: 'Nudity', value: 'nudity' },
            { label: 'Strong Language', value: 'language' },
            { label: 'Substance Use', value: 'substance' },
            { label: 'Flashing Lights', value: 'flashing' },
            { label: 'Mature Themes', value: 'mature' },
          ],
        },
      ],
    },

    /* -------------------------------------
     * FREQUENCY (Optional for recurring blocks)
     * ------------------------------------- */
    {
      name: 'isRecurring',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'For weekly recurring blocks.' },
    },

    {
      name: 'recurrenceNotes',
      type: 'text',
      admin: {
        description: 'Optional description of recurrence pattern.',
        condition: (_, sibling) => sibling.isRecurring === true,
      },
    },

    /* -------------------------------------
     * INTERNAL NOTES / PROGRAMMING
     * ------------------------------------- */
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal programming notes.' },
    },

    /* -------------------------------------
     * RECOMMENDATION ENGINE
     * ------------------------------------- */
    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: '0–5 priority for homepage / daily highlights.',
      },
    },

    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
