import type { CollectionConfig } from 'payload'

export const SearchIndex: CollectionConfig = {
  slug: 'search-index',

  admin: {
    group: 'Search',
    useAsTitle: 'title',
  },

  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: () => false,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['articles', 'vod', 'tracks', 'podcasts'],
      required: true,
    },
    {
      name: 'embedding',
      type: 'json',
      admin: { readOnly: true },
    },
    {
      name: 'keywords',
      type: 'text',
    },
  ],
}

export default SearchIndex
