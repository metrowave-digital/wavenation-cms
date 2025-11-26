import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Series: CollectionConfig = {
  slug: 'series',

  labels: {
    singular: 'Series',
    plural: 'Series',
  },

  admin: {
    useAsTitle: 'title',
    group: 'TV & Film',
    defaultColumns: ['title', 'type', 'status', 'algorithm.featuredPriority'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* BASIC */
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'TV Series', value: 'tv' },
        { label: 'Digital Series', value: 'digital' },
        { label: 'Podcast Series', value: 'podcast' },
        { label: 'Film Franchise', value: 'film' },
        { label: 'Documentary Series', value: 'doc' },
        { label: 'Editorial Series', value: 'editorial' },
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

    /* MEDIA */
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
    },

    /* CAST & CREW */
    {
      name: 'cast',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },
    {
      name: 'directors',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    /* EPISODES */
    {
      name: 'episodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },

    /* AGE RATING */
    {
      name: 'ageRating',
      type: 'select',
      options: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-PG', 'TV-14', 'TV-MA'],
    },

    /* AVAILABILITY */
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
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Apple TV', value: 'apple-tv' },
            { label: 'Roku', value: 'roku' },
            { label: 'Fire TV', value: 'fire-tv' },
          ],
        },
      ],
    },

    /* SCHEDULING */
    {
      name: 'releaseSchedule',
      type: 'group',
      fields: [
        { name: 'publishAt', type: 'date' },
        { name: 'unpublishAt', type: 'date' },
      ],
    },

    /* ALGORITHM */
    {
      name: 'algorithm',
      type: 'group',
      fields: [
        { name: 'popularityScore', type: 'number', defaultValue: 0 },
        { name: 'completionRate', type: 'number', defaultValue: 0 },
        { name: 'viewerRetention', type: 'number', defaultValue: 0 },
        { name: 'freshnessScore', type: 'number', defaultValue: 0 },
        { name: 'staffPick', type: 'checkbox', defaultValue: false },
        { name: 'featuredPriority', type: 'number', defaultValue: 0 },
      ],
    },

    SEOFields,
  ],
}

export default Series
