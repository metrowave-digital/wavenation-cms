import type { CollectionConfig } from 'payload'
import { generateSlug } from '../hooks/generateSlug'
import { allowAdminsAnd } from '../access/control'

export const Episodes: CollectionConfig = {
  slug: 'episodes',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'show', 'airDate'],
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
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'show',
      type: 'relationship',
      relationTo: 'shows',
      required: true,
    },

    { name: 'airDate', type: 'date', required: true },

    { name: 'description', type: 'richText', required: true },

    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Upload audio segment / podcast file' },
    },

    {
      name: 'videoEmbed',
      type: 'text',
      admin: { description: 'Podcast video version (YouTube, Vimeo)' },
    },

    {
      name: 'duration',
      type: 'text',
      admin: { description: 'Format: 01:23:45' },
    },

    /* METRICS */
    { name: 'playCount', type: 'number', defaultValue: 0 },
  ],
}
