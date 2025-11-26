import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const AnalyticsMetadata: CollectionConfig = {
  slug: 'analyticsMetadata',

  labels: {
    singular: 'Analytics Event',
    plural: 'Analytics Events',
  },

  admin: {
    group: 'Analytics',
    useAsTitle: 'eventType',
    defaultColumns: ['eventType', 'contentType', 'contentId', 'channel', 'timestamp'],
  },

  access: {
    read: allowRoles(['admin', 'editor', 'analyst']),
    create: () => true, // events logged publicly
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    // Event type
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Play', value: 'play' },
        { label: 'View', value: 'view' },
        { label: 'Like', value: 'like' },
        { label: 'Share', value: 'share' },
        { label: 'Comment', value: 'comment' },
        { label: 'Watch Progress', value: 'watch-progress' },
      ],
    },

    // Channel rollup source
    {
      name: 'channel',
      type: 'select',
      admin: { description: 'Platform where event happened' },
      options: [
        { label: 'Radio', value: 'radio' },
        { label: 'TV', value: 'tv' },
        { label: 'On-Demand', value: 'on-demand' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'App', value: 'app' },
      ],
    },

    // Category (Hip-Hop, Gospel, Afrobeats…)
    {
      name: 'category',
      type: 'text',
      admin: {
        description: 'Genre/category at the time of the event.',
      },
    },

    // Origin (Instagram / TikTok / Direct)
    {
      name: 'origin',
      type: 'text',
      admin: {
        description: 'Traffic source (instagram, tiktok, direct, push, etc.)',
      },
    },

    // Content reference
    { name: 'contentType', type: 'text', required: true },
    { name: 'contentId', type: 'text', required: true },

    // Optional user
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },

    // Device + geo
    { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'device', type: 'text' },
    { name: 'location', type: 'text' },

    // Extra data (progress, watch time)
    { name: 'extra', type: 'json' },
  ],
}
