// src/collections/ContinueWatching.ts
import type { CollectionConfig } from 'payload'

export const ContinueWatching: CollectionConfig = {
  slug: 'continue-watching',
  admin: {
    useAsTitle: 'vod',
    group: 'On-Demand',
  },
  access: {
    read: ({ req }) => !!req.user, // user must be logged in
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'vod',
      type: 'relationship',
      relationTo: 'vod',
      required: true,
    },
    {
      name: 'position',
      type: 'number',
      required: true,
      admin: {
        description: 'Playback position in seconds.',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Total length of the VOD item in seconds.',
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
  ],
  timestamps: true,
}
