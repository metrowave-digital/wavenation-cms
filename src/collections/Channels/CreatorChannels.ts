import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'

export const CreatorChannels: CollectionConfig = {
  slug: 'creator-channels',

  admin: {
    useAsTitle: 'name',
    group: 'Creator Channels',
    defaultColumns: ['name', 'creator', 'visibility', 'status', 'followersCount'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    /* BASIC INFO */
    { name: 'creator', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'textarea' },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'paused', 'archived'],
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
      admin: {
        condition: (data) => data?.visibility === 'tiers',
        description: 'Which tiers can access this channel',
      },
    },

    /* MEDIA */
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bannerVideo',
      type: 'upload',
      relationTo: 'media',
    },

    /* FOLLOWERS SYSTEM */
    {
      name: 'followers',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: {
        description: 'Users who follow this channel',
        position: 'sidebar',
      },
      defaultValue: [],
    },

    {
      name: 'followersCount',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-generated follower count',
      },
      defaultValue: 0,
    },

    /* (OPTIONAL) VIRTUAL FIELD */
    {
      name: 'followedByMe',
      type: 'checkbox',
      admin: {
        readOnly: true,
        description: 'Populated via API (not stored in DB)',
      },
      hooks: {
        beforeChange: [
          () => false, // prevent DB writes
        ],
      },
    },

    /* RELATIONSHIPS */
    {
      name: 'moderators',
      type: 'relationship',
      relationTo: 'channel-moderators',
      hasMany: true,
    },

    {
      name: 'announcements',
      type: 'relationship',
      relationTo: 'channel-announcements',
      hasMany: true,
    },

    /* SEO */
    { name: 'seo', type: 'group', fields: [seoFields] },

    /* AUDIT */
    { name: 'createdBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
    { name: 'updatedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true } },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        /* Auto-slug */
        if (data.name && !data.slug) {
          data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }

        /* Update follower count automatically */
        if (Array.isArray(data.followers)) {
          data.followersCount = data.followers.length
        }

        return data
      },
    ],
  },
}
