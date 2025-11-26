import type { CollectionConfig } from 'payload'
import { allowIfSelfOrAdmin } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const CreatorChannels: CollectionConfig = {
  slug: 'creator-channels',

  labels: {
    singular: 'Creator Channel',
    plural: 'Creator Channels',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Social',
    defaultColumns: ['name', 'owner', 'linkedProfile', 'status', 'metrics.followers'],
    description: 'Creator hubs for posting content, videos, tracks, series, and updates.',
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user, // must be logged in
    update: allowIfSelfOrAdmin,
    delete: allowIfSelfOrAdmin,
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    /* ------------------------------------------------------
     * OWNER & PROFILE LINKING
     * ------------------------------------------------------ */
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { description: 'The user account that manages this channel.' },
    },

    {
      name: 'linkedProfile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Optional – links this channel to a public profile page.',
      },
    },

    /* ------------------------------------------------------
     * CHANNEL BRANDING
     * ------------------------------------------------------ */
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
    },

    { name: 'bio', type: 'textarea' },

    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Square logo or avatar for the channel.' },
    },

    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Wide banner displayed at top of channel page.' },
    },

    {
      name: 'branding',
      type: 'group',
      admin: { description: 'Customize theme, colors, style, and layout.' },
      fields: [
        { name: 'primaryColor', type: 'text' },
        { name: 'accentColor', type: 'text' },
        {
          name: 'layoutStyle',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Hero Highlight', value: 'hero' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Card Grid', value: 'grid' },
          ],
        },
      ],
    },

    /* ------------------------------------------------------
     * CONTENT FEED (RELATIONSHIPS)
     * ------------------------------------------------------ */
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        description: 'Social posts created by or connected to this channel.',
      },
    },

    {
      name: 'videos',
      type: 'relationship',
      relationTo: 'videos',
      hasMany: true,
      admin: {
        description: 'Uploaded video content connected to this channel.',
      },
    },

    {
      name: 'tracks',
      type: 'relationship',
      relationTo: 'tracks',
      hasMany: true,
      admin: {
        description: 'Music tracks released by this creator.',
      },
    },

    {
      name: 'podcastEpisodes',
      type: 'relationship',
      relationTo: 'podcast-episodes',
      hasMany: true,
      admin: {
        description: 'Podcast content released under this channel.',
      },
    },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
      hasMany: true,
      admin: {
        description: 'Series, video series, or album/season-based content.',
      },
    },

    /* ------------------------------------------------------
     * SOCIAL GRAPH INTEGRATION
     * ------------------------------------------------------ */

    {
      name: 'followers',
      label: 'Channel Followers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { description: 'Users who follow this channel.' },
    },

    {
      name: 'followable',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'If disabled, users cannot follow this channel.' },
    },

    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'twitter', type: 'text', label: 'X' },
        { name: 'website', type: 'text' },
      ],
    },

    /* ------------------------------------------------------
     * MODERATION
     * ------------------------------------------------------ */
    {
      name: 'moderation',
      type: 'group',
      admin: { description: 'Controls for comments, language, and safety.' },
      fields: [
        {
          name: 'commentsEnabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'autoFlagThreshold',
          type: 'number',
          defaultValue: 3,
          admin: { description: 'Number of flags required before hiding content.' },
        },
        {
          name: 'allowReactions',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },

    /* ------------------------------------------------------
     * STATUS
     * ------------------------------------------------------ */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Deleted', value: 'deleted' },
      ],
    },

    /* ------------------------------------------------------
     * METRICS (AUTO UPDATED BY JOBS)
     * ------------------------------------------------------ */
    {
      name: 'metrics',
      type: 'group',
      admin: { description: 'Auto-updated for analytics & discovery.' },
      fields: [
        { name: 'followers', type: 'number', defaultValue: 0 },
        { name: 'views', type: 'number', defaultValue: 0 },
        { name: 'likes', type: 'number', defaultValue: 0 },
        { name: 'comments', type: 'number', defaultValue: 0 },
        { name: 'engagementScore', type: 'number', defaultValue: 0 },
        { name: 'influenceScore', type: 'number', defaultValue: 0 },
      ],
    },

    /* ------------------------------------------------------
     * DISCOVERY ENGINE WEIGHTS
     * ------------------------------------------------------ */
    {
      name: 'algorithm',
      type: 'group',
      admin: { description: 'Discovery weights for ranking channels.' },
      fields: [
        {
          name: 'staffPick',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'featuredPriority',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'trendingBoost',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'consistencyScore',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },

    SEOFields,
  ],
}
