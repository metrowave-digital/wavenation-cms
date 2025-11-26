import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'
import { EnhancedVideoMetadata } from '@/fields/videoMetadata'

export const Films: CollectionConfig = {
  slug: 'films',

  labels: {
    singular: 'Film',
    plural: 'Films',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Video',
    defaultColumns: ['title', 'genre', 'releaseYear', 'contentRating'],
  },

  access: {
    read: () => true, // Public read
    create: allowRoles(['editor', 'admin']), // Editors + admins can create
    update: allowRoles(['editor', 'admin']), // Editors + admins can update
    delete: isAdmin, // Only admins can delete
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    { name: 'slug', type: 'text', unique: true },

    { name: 'synopsis', type: 'richText', required: true },

    {
      name: 'releaseYear',
      type: 'number',
      required: true,
    },

    /* PRIMARY POSTER + MEDIA */
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },

    /* VIDEO */
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Film Video URL (HLS, CF Stream, MP4)',
    },

    {
      name: 'trailerUrl',
      type: 'text',
    },

    /* CREW / CAST */
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

    {
      name: 'producers',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    /* CATEGORY */
    {
      name: 'genre',
      type: 'relationship',
      relationTo: 'categories',
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    /* RATING */
    {
      name: 'contentRating',
      type: 'text',
      admin: { placeholder: 'TV-PG, TV-14, TV-MA' },
    },

    /* AVAILABILITY */
    {
      name: 'availability',
      type: 'group',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },
      ],
    },

    /* SEO */

    SEOFields,
    EnhancedVideoMetadata,
  ],
}
