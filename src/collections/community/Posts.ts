import type { CollectionConfig } from 'payload'
import { allowIfSelfOrAdmin } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'

export const Posts: CollectionConfig = {
  slug: 'posts',

  labels: {
    singular: 'Post',
    plural: 'Posts',
  },

  admin: {
    useAsTitle: 'slug',
    group: 'Social',
    defaultColumns: ['author', 'type', 'createdAt', 'visibility'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: allowIfSelfOrAdmin,
    delete: allowIfSelfOrAdmin,
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* AUTHOR */
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    { name: 'slug', type: 'text', unique: true },

    /* POST TYPE */
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Mixed Media', value: 'mixed' },
      ],
    },

    /* CONTENT */
    { name: 'text', type: 'textarea' },

    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Images, videos, or audio clips.' },
    },

    /* TAGGED USERS */
    {
      name: 'taggedUsers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    /* VISIBILITY */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Followers Only', value: 'followers' },
        { label: 'Private', value: 'private' },
      ],
    },

    /* COMMENTS / REACTIONS (linked in other collections) */

    /* GEOLOCATION (optional) */
    {
      name: 'location',
      type: 'text',
    },

    /* SCHEDULING */
    {
      name: 'scheduledAt',
      type: 'date',
      admin: { description: 'Optional scheduled publishing' },
    },

    /* METRICS */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'comments', type: 'number', defaultValue: 0 },
        { name: 'shares', type: 'number', defaultValue: 0 },
        { name: 'views', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
