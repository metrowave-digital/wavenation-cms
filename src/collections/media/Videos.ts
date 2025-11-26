import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'
import { EnhancedVideoMetadata } from '@/fields/videoMetadata'
import { MusicLicensingFields } from '@/fields/musicLicensing'

export const Videos: CollectionConfig = {
  slug: 'videos',

  labels: {
    singular: 'Video',
    plural: 'Videos',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Video',
    defaultColumns: ['title', 'type', 'duration', 'genre'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: isAdmin,
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Music Video', value: 'music-video' },
        { label: 'Interview', value: 'interview' },
        { label: 'Mini Documentary', value: 'mini-doc' },
        { label: 'Promo', value: 'promo' },
        { label: 'Short Film', value: 'short-film' },
        { label: 'Behind the Scenes', value: 'bts' },
        { label: 'Clip / Segment', value: 'clip' },
      ],
    },

    { name: 'description', type: 'richText' },

    /* MAIN VIDEO GROUP */
    {
      name: 'video',
      type: 'group',
      fields: [
        { name: 'videoUrl', type: 'text' },
        { name: 'cloudflareId', type: 'text' },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'duration', type: 'number' },
      ],
    },

    /* CREATIVE CREDITS */
    {
      name: 'featuredProfiles',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    /* GENRE + TAGS */
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
    MusicLicensingFields,

    /* FULL VIDEO METADATA (auto + manual) */
    EnhancedVideoMetadata,
  ],
}
