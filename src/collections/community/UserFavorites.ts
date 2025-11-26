import type { CollectionConfig } from 'payload'

export const UserFavorites: CollectionConfig = {
  slug: 'user-favorites',
  labels: {
    singular: 'Favorite Item',
    plural: 'User Favorites',
  },

  admin: {
    useAsTitle: 'itemId',
    group: 'Users',
    defaultColumns: ['user', 'itemType', 'itemId'],
  },

  access: {
    read: ({ req }) => !!req.user, // logged-in only
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'itemType',
      type: 'text',
      required: true,
      admin: { description: 'Example: post, video, track, playlist, vod, etc.' },
    },

    {
      name: 'itemId',
      type: 'text',
      required: true,
    },

    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Optional cached metadata for faster UI display.',
      },
    },
  ],

  // Prevent duplicate favorites
  indexes: [
    {
      fields: ['user', 'itemType', 'itemId'],
      unique: true,
    },
  ],
}

export default UserFavorites
