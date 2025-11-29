import type { CollectionConfig } from 'payload'

export const ChannelPosts: CollectionConfig = {
  slug: 'channel-posts',

  admin: {
    useAsTitle: 'title',
    group: 'Creator Channels',
    defaultColumns: ['title', 'channel', 'visibility', 'postType'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'channel', type: 'relationship', relationTo: 'creator-channels', required: true },
    { name: 'title', type: 'text' },

    {
      name: 'postType',
      type: 'select',
      required: true,
      options: ['text', 'image', 'video', 'audio', 'gallery', 'embed', 'poll', 'announcement'].map(
        (v) => ({ label: v, value: v }),
      ),
    },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'Tier-Restricted', value: 'tiers' },
      ],
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: { condition: (data) => data?.visibility === 'tiers' },
    },

    /* CONTENT BLOCKS */
    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (data) => data?.postType === 'text' || data?.postType === 'announcement',
      },
    },

    { name: 'images', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'video', type: 'upload', relationTo: 'media' },
    { name: 'audio', type: 'upload', relationTo: 'media' },

    {
      name: 'embed',
      type: 'text',
      admin: {
        condition: (data) => data?.postType === 'embed',
        description: 'Embed URL (YouTube, Vimeo, SoundCloud, Bandcamp, etc.)',
      },
    },

    /* POLL BLOCK */
    {
      name: 'pollOptions',
      type: 'array',
      admin: { condition: (data) => data?.postType === 'poll' },
      fields: [
        { name: 'option', type: 'text' },
        { name: 'votes', type: 'number', defaultValue: 0 },
      ],
    },

    /* RELATIONSHIPS */
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'channel-media',
      hasMany: true,
      admin: { description: 'Associated channel media' },
    },

    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'channel-comments',
      hasMany: true,
    },

    /* AUDIT */
    { name: 'createdBy', type: 'relationship', relationTo: 'profiles' },
    { name: 'updatedBy', type: 'relationship', relationTo: 'profiles' },
  ],
}
