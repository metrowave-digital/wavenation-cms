import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'
import { generateSlug } from '../hooks/generateSlug'

export const Shows: CollectionConfig = {
  slug: 'shows',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'host', 'followerCount'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor', 'host-dj']),
    update: allowAdminsAnd(['editor', 'host-dj']),
    delete: allowAdminsAnd(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Radio Show', value: 'radio' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Live Stream', value: 'live' },
      ],
      required: true,
    },

    { name: 'tagline', type: 'text' },

    /* HOSTS */
    {
      name: 'host',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    /* PROMO MEDIA */
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'promoImages',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
    },

    { name: 'promoVideo', type: 'text' },

    /* SCHEDULE */
    {
      name: 'airTimes',
      type: 'array',
      fields: [
        { name: 'day', type: 'text' },
        { name: 'start', type: 'text' },
        { name: 'end', type: 'text' },
      ],
    },

    /* DESCRIPTION */
    { name: 'description', type: 'richText', required: true },

    /* EPISODES */
    {
      name: 'episodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },

    /* SOCIAL */
    {
      name: 'externalLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },

    /* METRICS */
    { name: 'followerCount', type: 'number', defaultValue: 0 },
    { name: 'playCount', type: 'number', defaultValue: 0 },
  ],
}
