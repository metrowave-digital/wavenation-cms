import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Shows: CollectionConfig = {
  slug: 'shows',

  labels: {
    singular: 'Show',
    plural: 'Shows',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Programming',
    defaultColumns: [
      'title',
      'format',
      'primaryChannel',
      'status',
      'staffPick',
      'featuredPriority',
    ],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'creator', 'host-dj', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* ----------------------------------------
     * BASIC INFO
     * ---------------------------------------- */
    { name: 'title', type: 'text', required: true },

    { name: 'slug', type: 'text', unique: true },

    {
      name: 'format',
      type: 'select',
      defaultValue: 'radio',
      options: [
        { label: 'Radio Show', value: 'radio' },
        { label: 'TV Show', value: 'tv' },
        { label: 'Digital Series', value: 'digital-series' },
        { label: 'Podcast-Based Show', value: 'podcast-show' },
      ],
    },

    {
      name: 'primaryChannel',
      type: 'select',
      defaultValue: 'radio',
      options: [
        { label: 'Radio', value: 'radio' },
        { label: 'TV / OTT', value: 'tv' },
        { label: 'On-Demand', value: 'on-demand' },
        { label: 'Simulcast', value: 'simulcast' },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hiatus', value: 'hiatus' },
        { label: 'Ended', value: 'ended' },
      ],
    },

    { name: 'description', type: 'richText' },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
      label: 'Show Artwork',
    },

    {
      name: 'trailerMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Show Trailer (Video or Audio)',
    },

    /* ----------------------------------------
     * HOSTS & CAST
     * ---------------------------------------- */
    {
      name: 'hostProfiles',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    {
      name: 'djHosts',
      type: 'relationship',
      relationTo: 'dj-hosts',
      hasMany: true,
    },

    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    /* ----------------------------------------
     * SOCIAL LINKS
     * ---------------------------------------- */
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text', label: 'X / Twitter' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },

    /* ----------------------------------------
     * AVAILABILITY WINDOWS (TV / Digital)
     * ---------------------------------------- */
    {
      name: 'availability',
      type: 'group',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },

        {
          name: 'platforms',
          type: 'select',
          hasMany: true,
          admin: { description: 'Where the show is available.' },
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Apple TV', value: 'apple-tv' },
            { label: 'Roku', value: 'roku' },
            { label: 'Fire TV', value: 'fire-tv' },
            { label: 'Radio', value: 'radio' },
          ],
        },

        {
          name: 'countryRestrictions',
          type: 'array',
          fields: [{ name: 'country', type: 'text' }],
        },
      ],
    },

    /* ----------------------------------------
     * AGE RATINGS (TV / Film Standards)
     * ---------------------------------------- */
    {
      name: 'ageRatings',
      type: 'group',
      fields: [
        {
          name: 'mpaa',
          type: 'select',
          options: ['G', 'PG', 'PG-13', 'R', 'NC-17'].map((r) => ({
            label: r,
            value: r,
          })),
        },
        {
          name: 'tvRating',
          type: 'select',
          options: ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'].map((v) => ({
            label: v,
            value: v,
          })),
        },
        {
          name: 'contentWarnings',
          type: 'array',
          fields: [{ name: 'warning', type: 'text' }],
        },
      ],
    },

    /* ----------------------------------------
     * DISCOVERY (Algorithm Fields)
     * ---------------------------------------- */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Boosts show visibility in algorithms.' },
    },

    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Higher = more prominent placement.' },
    },

    {
      name: 'newEpisodeBoost',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Algorithm boost when new episodes release.' },
    },

    /* ----------------------------------------
     * METRICS (For Algorithm Settings)
     * ---------------------------------------- */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'viewership', type: 'number', defaultValue: 0 },
        { name: 'liveRatings', type: 'number', defaultValue: 0 },
        { name: 'averageWatchTime', type: 'number', defaultValue: 0 },
        { name: 'socialEngagement', type: 'number', defaultValue: 0 },
        { name: 'clipPerformance', type: 'number', defaultValue: 0 },
        {
          name: 'popularityScore',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Set by recommendation engine.' },
        },
      ],
    },

    /* ----------------------------------------
     * SEO
     * ---------------------------------------- */
    SEOFields,
  ],
}

export default Shows
