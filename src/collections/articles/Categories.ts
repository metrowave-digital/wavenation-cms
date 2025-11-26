import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    group: 'Taxonomy',
    defaultColumns: ['name', 'type', 'isActive', 'featured', 'priority'],
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
    /* BASIC INFO */
    { name: 'name', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Music Genre', value: 'music' },
        { label: 'Mood / Vibe', value: 'mood' },
        { label: 'Subgenre', value: 'subgenre' },
        { label: 'News / Editorial', value: 'editorial' },
        { label: 'Film / TV Genre', value: 'film-tv' },
        { label: 'Podcast Topic', value: 'podcast' },
        { label: 'Event Category', value: 'event' },
        { label: 'Creator Niche', value: 'creator' },
      ],
    },

    { name: 'description', type: 'textarea' },

    /* HIERARCHY */
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
    },

    /* BRANDING */
    { name: 'color', type: 'text' },
    { name: 'icon', type: 'text' },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    /* FLAGS */
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },

    /* PRIORITY */
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
    },

    /* DISCOVERY */
    {
      name: 'keywords',
      type: 'array',
      fields: [{ name: 'keyword', type: 'text' }],
    },
    {
      name: 'aliases',
      type: 'array',
      fields: [{ name: 'alias', type: 'text' }],
    },

    /* AGE RATINGS */
    {
      name: 'ageRating',
      type: 'group',
      admin: { condition: (_, d) => d.type === 'film-tv' },
      fields: [
        {
          name: 'tvRating',
          type: 'select',
          options: ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
        },
        {
          name: 'movieRating',
          type: 'select',
          options: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
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

    /* AVAILABILITY */
    {
      name: 'availability',
      type: 'group',
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

    /* ALGORITHM FIELDS */
    {
      name: 'algorithm',
      type: 'group',
      fields: [
        { name: 'popularityScore', type: 'number', defaultValue: 0 },
        { name: 'engagementScore', type: 'number', defaultValue: 0 },
        { name: 'freshnessScore', type: 'number', defaultValue: 0 },
        { name: 'staffPick', type: 'checkbox', defaultValue: false },
        { name: 'featuredPriority', type: 'number', defaultValue: 0 },
      ],
    },

    /* SEO */
    SEOFields,
  ],
}

export default Categories
