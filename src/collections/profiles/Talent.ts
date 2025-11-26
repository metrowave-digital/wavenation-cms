// src/collections/Talent.ts
import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Talent: CollectionConfig = {
  slug: 'talent',

  labels: {
    singular: 'Talent Member',
    plural: 'Talent',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Programming',
    defaultColumns: ['name', 'roleType', 'active', 'staffPick', 'featuredPriority'],
    description:
      'Radio hosts, DJs, TV personalities, commentators, podcasters, reporters, presenters, MCs.',
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
        { label: 'Radio Host', value: 'radio-host' },
        { label: 'DJ', value: 'dj' },
        { label: 'TV Host / Presenter', value: 'tv-host' },
        { label: 'Reporter / Journalist', value: 'reporter' },
        { label: 'Commentator / Analyst', value: 'commentator' },
        { label: 'Podcast Host', value: 'podcast-host' },
        { label: 'MC / Event Host', value: 'event-host' },
        { label: 'Creator / Influencer', value: 'creator' },
        { label: 'Actor / Performer', value: 'performer' },
        { label: 'Other', value: 'other' },
      ],
    },

    /* PROFILE LINKS */
    {
      name: 'linkedProfile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Optional – link to a main profile page.',
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
      admin: { description: 'Headshot or promotional image.' },
    },
    { name: 'bio', type: 'richText' },

    /* SCHEDULE & AVAILABILITY */
    {
      name: 'availability',
      type: 'group',
      admin: { description: 'Preferred on-air days and times.' },
      fields: [
        {
          name: 'daysOfWeek',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Monday', value: 'mon' },
            { label: 'Tuesday', value: 'tue' },
            { label: 'Wednesday', value: 'wed' },
            { label: 'Thursday', value: 'thu' },
            { label: 'Friday', value: 'fri' },
            { label: 'Saturday', value: 'sat' },
            { label: 'Sunday', value: 'sun' },
          ],
        },
        { name: 'preferredDaypart', type: 'text' },
      ],
    },

    /* SOCIALS */
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text', label: 'X' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'socialReach',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Combined follower count across platforms.' },
    },

    /* LINKED CONTENT */
    {
      name: 'shows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
      admin: { description: 'Shows this talent participates in.' },
    },
    {
      name: 'episodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
      admin: { description: 'Episodes featuring this talent.' },
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: { description: 'Events hosted or attended by the talent.' },
    },

    /* ALGORITHM */
    {
      name: 'algorithm',
      type: 'group',
      admin: { description: 'Algorithm ranking metrics for this talent.' },
      fields: [
        {
          name: 'engagementScore',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'How frequently audiences engage with them.' },
        },
        {
          name: 'eventAppearances',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'How active they are in events.' },
        },
        {
          name: 'showAppearances',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'How many shows they appear on.' },
        },
        {
          name: 'recentActivity',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Algorithm score for recent contributions.',
          },
        },
        {
          name: 'crossPlatformInfluence',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Influence across radio, tv, digital, and live.',
          },
        },
      ],
    },

    /* DISCOVERY / PROMOTION */
    {
      name: 'staffPick',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Manual boost by staff.' },
    },
    {
      name: 'featuredPriority',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Higher = more prominent in recommendations.' },
    },

    /* STATUS */
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },

    /* SEO */
    SEOFields,
  ],
}

export default Talent
