import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const Reactions: CollectionConfig = {
  slug: 'reactions',

  labels: {
    singular: 'Reaction',
    plural: 'Reactions',
  },

  admin: {
    useAsTitle: 'reaction',
    group: 'Engagement',
    defaultColumns: ['reaction', 'target', 'user', 'createdAt'],
  },

  access: {
    read: allowRoles(['admin', 'editor', 'analyst']),
    create: () => true, // public reactions allowed
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    // Reaction type
    {
      name: 'reaction',
      type: 'select',
      required: true,
      options: [
        { label: 'Like', value: 'like' },
        { label: 'Love', value: 'love' },
        { label: 'Funny', value: 'funny' },
        { label: 'Sad', value: 'sad' },
        { label: 'Angry', value: 'angry' },
        { label: 'Fire', value: 'fire' },
        { label: 'Wow', value: 'wow' },
      ],
    },

    // Target content (universal: episodes, films, articles, series, posts, polls)
    {
      name: 'target',
      type: 'relationship',
      required: true,
      relationTo: ['episodes', 'films', 'articles', 'series', 'posts', 'polls'],
    },

    // Optional user who reacted
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    // Optional IP address for abuse detection
    {
      name: 'ipAddress',
      type: 'text',
      required: false,
    },

    // Optional metadata (platform, device, etc.)
    {
      name: 'meta',
      type: 'json',
      required: false,
    },
  ],
}
