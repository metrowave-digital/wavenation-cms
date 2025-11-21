import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const Playlists: CollectionConfig = {
  slug: 'playlists',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor', 'host-dj']),
    update: allowAdminsAnd(['editor', 'host-dj']),
    delete: allowAdminsAnd(['admin']),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'editorial',
      options: [
        { label: 'Editorial', value: 'editorial' },
        { label: 'Radio Rotation', value: 'rotation' },
        { label: 'Mood Playlist', value: 'mood' },
        { label: 'Show Playlist', value: 'show' },
        { label: 'User Playlist', value: 'user' },
      ],
    },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'attachedShow',
      type: 'relationship',
      relationTo: 'shows',
      admin: { description: 'Optional — playlist used on-air for a show.' },
    },

    {
      name: 'tracks',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'artist',
          type: 'relationship',
          relationTo: 'profiles',
        },
        {
          name: 'audio',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'coverArt',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'duration',
          type: 'text',
        },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    /* SEO */
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'keywords', type: 'textarea' },
      ],
    },
  ],
}
