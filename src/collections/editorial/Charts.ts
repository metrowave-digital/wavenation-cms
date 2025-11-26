import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Charts: CollectionConfig = {
  slug: 'charts',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'chartDate', 'type', 'status'],
  },

  access: {
    read: () => true,
    create: allowRoles(['editor', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: allowRoles(['admin']),
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'music',
      options: [
        { label: 'Music Chart', value: 'music' },
        { label: 'Radio Spins Chart', value: 'radio' },
        { label: 'Playlist Chart', value: 'playlist' },
        { label: 'Editorial Pick Rankings', value: 'editorial' },
      ],
    },

    {
      name: 'chartDate',
      type: 'date',
      required: true,
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

    {
      name: 'entries',
      type: 'array',
      required: true,
      admin: { description: 'Chart positions for this week.' },
      fields: [
        {
          name: 'position',
          type: 'number',
          required: true,
        },
        {
          name: 'movement',
          type: 'number',
          admin: {
            description: 'Positive = up, negative = down, 0 = same.',
          },
        },
        {
          name: 'weeksOnChart',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'trackTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'artist',
          type: 'relationship',
          relationTo: 'profiles',
        },
        {
          name: 'coverArt',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'linkedPlaylist',
          type: 'relationship',
          relationTo: 'playlists',
        },
      ],
    },

    {
      name: 'editorialNotes',
      type: 'richText',
    },

    SEOFields,
  ],
}

export default Charts
