import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'
import { MusicLicensingFields } from '@/fields/musicLicensing'

export const Albums: CollectionConfig = {
  slug: 'albums',

  labels: {
    singular: 'Album',
    plural: 'Albums',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'artist', 'releaseYear', 'albumType'],
  },

  access: {
    read: () => true,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: allowRoles(['admin']),
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'albumType',
      type: 'select',
      defaultValue: 'album',
      options: [
        { label: 'Album', value: 'album' },
        { label: 'EP', value: 'ep' },
        { label: 'Single', value: 'single' },
        { label: 'Compilation', value: 'compilation' },
        { label: 'Live Album', value: 'live' },
      ],
    },

    { name: 'releaseYear', type: 'number', required: true },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
    },

    {
      name: 'tracks',
      type: 'relationship',
      relationTo: 'tracks',
      hasMany: true,
      admin: { description: 'Tracklist for this album.' },
    },

    { name: 'description', type: 'richText' },

    {
      name: 'platformLinks',
      type: 'group',
      fields: [
        { name: 'spotify', type: 'text' },
        { name: 'apple', type: 'text', label: 'Apple Music' },
        { name: 'youtube', type: 'text' },
      ],
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'streams', type: 'number', defaultValue: 0 },
        { name: 'likes', type: 'number', defaultValue: 0 },
      ],
    },

    SEOFields,
    MusicLicensingFields,
  ],
}

export default Albums
