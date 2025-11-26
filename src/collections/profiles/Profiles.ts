// src/collections/Profiles.ts
import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Profiles: CollectionConfig = {
  slug: 'profiles',

  labels: {
    singular: 'Profile',
    plural: 'Profiles',
  },

  admin: {
    useAsTitle: 'displayName',
    group: 'People',
    defaultColumns: [
      'displayName',
      'creatorType',
      'verified',
      'socialReach',
      'algorithm.featuredPriority',
    ],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: isAdmin,
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    /* BASIC IDENTIFICATION */
    { name: 'displayName', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'ownerUser',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Underlying account owner for this profile.' },
    },

    {
      name: 'creatorType',
      type: 'select',
      required: true,
      defaultValue: 'creator',
      admin: { description: 'Primary field used across apps.' },
      options: [
        { label: 'Artist / Music Artist', value: 'artist' },
        { label: 'DJ / Host', value: 'dj' },
        { label: 'Radio Personality', value: 'radio-host' },
        { label: 'TV Host / Presenter', value: 'tv-host' },
        { label: 'Podcaster', value: 'podcaster' },
        { label: 'Filmmaker', value: 'filmmaker' },
        { label: 'Journalist / Writer', value: 'journalist' },
        { label: 'Influencer / Creator', value: 'creator' },
        { label: 'Staff / Admin', value: 'staff' },
        { label: 'Guest / Featured', value: 'guest' },
        { label: 'Other', value: 'other' },
      ],
    },

    /* VERIFICATION & BRAND */
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Rising Creator', value: 'rising' },
        { label: 'Viral Moment', value: 'viral' },
        { label: 'Premier Creator', value: 'premier' },
        { label: 'Staff Pick', value: 'staff-pick' },
        { label: 'OG Member', value: 'og' },
      ],
    },

    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'bio',
      type: 'richText',
    },

    /* THEME & LINK-IN-BIO */
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'primaryColor', type: 'text' },
        { name: 'accentColor', type: 'text' },
        {
          name: 'layoutStyle',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Hero Banner', value: 'hero' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Card Grid', value: 'grid' },
          ],
        },
      ],
    },
    {
      name: 'linkInBio',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Music', value: 'music' },
            { label: 'Video', value: 'video' },
            { label: 'Tickets', value: 'tickets' },
            { label: 'Shop', value: 'shop' },
          ],
        },
      ],
    },

    /* SOCIAL LINKS & STATS */
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text', label: 'X' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'soundcloud', type: 'text' },
        { name: 'spotify', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
    {
      name: 'socialReach',
      type: 'number',
      defaultValue: 0,
    },

    /* MONETIZATION */
    {
      name: 'monetization',
      type: 'group',
      fields: [
        { name: 'tipsEnabled', type: 'checkbox', defaultValue: false },
        { name: 'subscriptionsEnabled', type: 'checkbox', defaultValue: false },
        { name: 'sponsorshipsEnabled', type: 'checkbox', defaultValue: false },
        { name: 'payoutAccountId', type: 'text' },
      ],
    },

    /* CROSS-LINKED CONTENT */
    { name: 'shows', type: 'relationship', relationTo: 'shows', hasMany: true },
    { name: 'episodes', type: 'relationship', relationTo: 'episodes', hasMany: true },
    { name: 'articles', type: 'relationship', relationTo: 'articles', hasMany: true },
    { name: 'playlists', type: 'relationship', relationTo: 'playlists', hasMany: true },
    { name: 'events', type: 'relationship', relationTo: 'events', hasMany: true },
    {
      name: 'creatorChannels',
      type: 'relationship',
      relationTo: 'creator-channels',
      hasMany: true,
    },

    /* 🆕 RECOMMENDATION FIELDS */
    {
      name: 'interests',
      type: 'select',
      hasMany: true,
      admin: { description: 'Topics + genres used for personalization.' },
      options: [
        { label: 'Hip-Hop', value: 'hiphop' },
        { label: 'R&B', value: 'rnb' },
        { label: 'Gospel', value: 'gospel' },
        { label: 'Afrobeats', value: 'afrobeats' },
        { label: 'News', value: 'news' },
        { label: 'Sports', value: 'sports' },
        { label: 'Film', value: 'film' },
        { label: 'Tech', value: 'tech' },
        { label: 'Culture', value: 'culture' },
        { label: 'Education', value: 'education' },
      ],
    },
    {
      name: 'favoriteCreators',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: {
        description: 'Profiles this user interacts with most (auto-updated).',
      },
    },
    {
      name: 'lastActive',
      type: 'date',
      admin: {
        description: 'Used by the recommender to weight freshness.',
      },
    },

    /* ALGORITHM SETTINGS */
    {
      name: 'algorithm',
      type: 'group',
      fields: [
        { name: 'engagementScore', type: 'number', defaultValue: 0 },
        { name: 'activityScore', type: 'number', defaultValue: 0 },
        { name: 'crossPlatformInfluence', type: 'number', defaultValue: 0 },
        { name: 'consistencyScore', type: 'number', defaultValue: 0 },
        { name: 'staffPick', type: 'checkbox', defaultValue: false },
        { name: 'featuredPriority', type: 'number', defaultValue: 0 },
      ],
    },

    /* SEO */
    SEOFields,
  ],
}

export default Profiles
