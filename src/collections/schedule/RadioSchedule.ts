import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin, publicRead } from '@/access/control'

export const RadioSchedule: CollectionConfig = {
  slug: 'radio-schedule',

  labels: {
    singular: 'Radio Schedule Block',
    plural: 'Radio Schedule',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Programming',
    defaultColumns: [
      'title',
      'programType',
      'dayOfWeek',
      'startTime',
      'endTime',
      'show',
      'playlist',
    ],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'host-dj', 'admin']),
    delete: isAdmin,
  },

  fields: [
    /* ---------------------------------------------------
     * BASIC INFO
     * --------------------------------------------------- */
    { name: 'title', type: 'text', required: true },

    {
      name: 'programType',
      type: 'select',
      required: true,
      defaultValue: 'show',
      options: [
        { label: 'Radio Show', value: 'show' },
        { label: 'Specific Episode', value: 'episode' },
        { label: 'Music Block / Playlist', value: 'playlist' },
        { label: 'Rotation Category', value: 'rotation' },
        { label: 'Specialty Hour', value: 'specialty' },
        { label: 'Mixshow / DJ Set', value: 'dj-mix' },
        { label: 'Live Broadcast', value: 'live' },
        { label: 'Simulcast (TV/Live)', value: 'simulcast' },
      ],
    },

    /* ---------------------------------------------------
     * DAY & TIME
     * --------------------------------------------------- */
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
      admin: { description: '24h format, e.g. 10:00' },
    },

    {
      name: 'endTime',
      type: 'text',
      required: true,
      admin: { description: '24h format, e.g. 12:00' },
    },

    /* ---------------------------------------------------
     * PROGRAM SOURCES
     * --------------------------------------------------- */

    // RADIO SHOW (Talk, Hosted, Mixshows)
    {
      name: 'show',
      type: 'relationship',
      relationTo: 'shows',
      admin: {
        condition: (_, sibling) =>
          sibling.programType === 'show' ||
          sibling.programType === 'dj-mix' ||
          sibling.programType === 'live' ||
          sibling.programType === 'simulcast',
      },
    },

    // SPECIFIC EPISODE
    {
      name: 'episode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: {
        condition: (_, sibling) => sibling.programType === 'episode',
        description: 'Schedule a specific episode.',
      },
    },

    // PLAYLIST BLOCK (R1, R2, R3, QS1, QS2, etc.)
    {
      name: 'playlist',
      type: 'relationship',
      relationTo: 'playlists',
      admin: {
        condition: (_, sibling) => sibling.programType === 'playlist',
        description: 'Music block: rotations, specialty playlists, mix playlists, etc.',
      },
    },

    // ROTATION (Category-based)
    {
      name: 'rotationCategory',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (_, sibling) => sibling.programType === 'rotation',
        description: 'Rotation block (e.g., R1, R2, R3, Gold, Throwbacks)',
      },
    },

    // SPECIALTY HOUR
    {
      name: 'specialtyCategory',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (_, sibling) => sibling.programType === 'specialty',
        description: 'Specialty hour theme (Gospel, Southern Soul, Local Artist Hour)',
      },
    },

    /* ---------------------------------------------------
     * TALENT / DJ
     * --------------------------------------------------- */
    {
      name: 'djHost',
      type: 'relationship',
      relationTo: 'dj-hosts',
      admin: {
        condition: (_, sibling) =>
          sibling.programType === 'dj-mix' ||
          sibling.programType === 'live' ||
          sibling.programType === 'show',
      },
    },

    /* ---------------------------------------------------
     * AVAILABILITY WINDOWS
     * --------------------------------------------------- */
    {
      name: 'availability',
      type: 'group',
      label: 'Availability Window',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },
        {
          name: 'blackoutDates',
          type: 'array',
          admin: { description: 'Holidays, outages, preemptions' },
          fields: [{ name: 'date', type: 'date' }],
        },
      ],
    },

    /* ---------------------------------------------------
     * AGE RATING (Talk / Explicit Shows)
     * --------------------------------------------------- */
    {
      name: 'ageRating',
      type: 'group',
      admin: {
        description: 'Required for explicit talk shows or late-night blocks.',
      },
      fields: [
        {
          name: 'radioRating',
          type: 'select',
          options: [
            { label: 'Clean', value: 'clean' },
            { label: 'PG (Mild language)', value: 'pg' },
            { label: 'Explicit', value: 'explicit' },
            { label: 'Mature', value: 'mature' },
          ],
        },
        {
          name: 'contentWarnings',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Strong Language', value: 'language' },
            { label: 'Adult Themes', value: 'adult' },
            { label: 'Suggestive Content', value: 'suggestive' },
            { label: 'Violence Discussion', value: 'violence' },
            { label: 'Substance Use', value: 'substance' },
          ],
        },
      ],
    },

    /* ---------------------------------------------------
     * RECURRING / SPECIAL EVENT SUPPORT
     * --------------------------------------------------- */
    {
      name: 'isRecurring',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Weekly block (default).' },
    },

    {
      name: 'recurrenceNotes',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling.isRecurring === false,
        description: 'Describe special one-off programming or seasonal blocks.',
      },
    },

    /* ---------------------------------------------------
     * INTERNAL NOTES
     * --------------------------------------------------- */
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal programming / automation notes.',
      },
    },

    /* ---------------------------------------------------
     * RECOMMENDATION ENGINE
     * --------------------------------------------------- */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: { description: '0–5 for homepage / highlights.' },
    },
  ],
}
