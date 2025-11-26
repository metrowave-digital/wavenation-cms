// src/collections/DJHosts.ts
import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const DJHosts: CollectionConfig = {
  slug: 'dj-hosts',

  labels: {
    singular: 'DJ / Host',
    plural: 'DJs & Hosts',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Programming',
    defaultColumns: ['name', 'roleType', 'active', 'staffPick', 'featuredPriority'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* BASIC INFO */
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'roleType',
      type: 'select',
      required: true,
      options: [
        { label: 'Radio DJ', value: 'dj' },
        { label: 'Radio Host', value: 'radio-host' },
        { label: 'TV Host', value: 'tv-host' },
        { label: 'Announcer', value: 'announcer' },
        { label: 'Producer', value: 'producer' },
        { label: 'MC / Event Host', value: 'event-host' },
        { label: 'Other', value: 'other' },
      ],
    },

    /* PROFILE LINK */
    {
      name: 'linkedProfile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Link to the main Profile entry (optional).',
      },
    },
    {
      name: 'userAccount',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Underlying user account if they have login access.' },
    },

    /* MEDIA */
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Headshot or promotional photo.' },
    },
    { name: 'bio', type: 'richText' },

    /* SPECIALIZATION */
    {
      name: 'genres',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Hip-Hop', value: 'hiphop' },
        { label: 'R&B', value: 'rnb' },
        { label: 'Gospel', value: 'gospel' },
        { label: 'Afrobeats', value: 'afrobeats' },
        { label: 'House', value: 'house' },
        { label: 'Southern Soul', value: 'southern-soul' },
        { label: 'Pop', value: 'pop' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'bpmRange',
      type: 'group',
      fields: [
        { name: 'minBpm', type: 'number' },
        { name: 'maxBpm', type: 'number' },
      ],
    },

    /* SOCIALS + IMPACT */
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text', label: 'X' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'soundcloud', type: 'text' },
      ],
    },
    {
      name: 'socialReach',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Follower count across platforms.' },
    },

    /* ASSOCIATED CONTENT */
    {
      name: 'shows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
      admin: { description: 'Shows this DJ/Host appears on.' },
    },
    {
      name: 'episodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },

    /* PERFORMANCE METRICS */
    {
      name: 'performance',
      type: 'group',
      fields: [
        {
          name: 'mixPerformance',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'DJ mix performance rating (algorithm).' },
        },
        {
          name: 'listenerRetention',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'How well listeners stay during their show.' },
        },
        {
          name: 'radioEngagement',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Call-ins, chat messages, reactions.' },
        },
        {
          name: 'onAirFrequency',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'How often they appear on-air weekly.' },
        },
        {
          name: 'genreAuthority',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Authority score for genres they represent.',
          },
        },
        {
          name: 'popularityScore',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Set by recommendation engine.' },
        },
      ],
    },

    /* DISCOVERY / STATUS */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Boosts this host in rankings.' },
    },
    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Higher = more priority in discovery.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },

    /* SEO */
    SEOFields,
  ],
}

export default DJHosts
