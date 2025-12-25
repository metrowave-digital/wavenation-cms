import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'
import { seoFields } from '../../fields/seo'

export const CreatorChannels: CollectionConfig = {
  slug: 'creator-channels',

  admin: {
    useAsTitle: 'name',
    group: 'Creator Channels',
    defaultColumns: ['name', 'creator', 'visibility', 'status', 'followersCount'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ENTERPRISE)
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic,
    create: AccessControl.isCreator,

    // Owner/moderator/staff/admin can update
    update: ({ req, data }) => AccessControl.canEditChannel(req, data as any),

    delete: AccessControl.isAdmin,
  },

  fields: [
    /* ================= BASIC INFO ================= */
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    { name: 'name', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },

    { name: 'description', type: 'textarea' },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'paused', 'archived'],
    },

    /* ================= VISIBILITY ================= */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'Tier-Restricted', value: 'tiers' },
      ],
      access: {
        // Field-level uses FieldAccess (boolean) not Access
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: {
        condition: (_, data) => data?.visibility === 'tiers',
        description: 'Which tiers can access this channel',
      },
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    /* ================= MEDIA ================= */
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

    /* ================= FOLLOWERS ================= */
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
      access: {
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'followersCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-generated follower count',
      },
      access: {
        update: () => false,
      },
    },

    /* ================= VIRTUAL FIELD ================= */
    {
      name: 'followedByMe',
      type: 'checkbox',
      admin: {
        readOnly: true,
        description: 'Computed at runtime (not stored)',
      },
      hooks: {
        beforeChange: [() => false],
      },
      access: {
        update: () => false,
      },
    },

    /* ================= RELATIONSHIPS ================= */
    {
      name: 'moderators',
      type: 'relationship',
      relationTo: 'channel-moderators',
      hasMany: true,
      access: {
        update: AccessControl.isStaffAccessField, // prevent self-assign
      },
    },

    {
      name: 'announcements',
      type: 'relationship',
      relationTo: 'channel-announcements',
      hasMany: true,
    },

    /* ================= SEO ================= */
    {
      name: 'seo',
      type: 'group',
      fields: [seoFields],
    },

    /* ================= AUDIT ================= */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { update: () => false },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: { update: () => false },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }

        /* Auto-slug */
        if (data?.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        /* Denormalize follower count */
        if (Array.isArray(data?.followers)) {
          data.followersCount = data.followers.length
        }

        return data
      },
    ],
  },
}

export default CreatorChannels
