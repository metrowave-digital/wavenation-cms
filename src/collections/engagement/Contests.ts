import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const Contests: CollectionConfig = {
  slug: 'contests',

  labels: {
    singular: 'Contest',
    plural: 'Contests',
  },

  admin: {
    group: 'Engagement',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'startDate', 'endDate'],
  },

  access: {
    read: () => true,
    create: allowRoles(['admin', 'editor', 'creator']),
    update: allowRoles(['admin', 'editor', 'creator']),
    delete: allowRoles(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'richText', required: true },

    {
      name: 'type',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'Music Submission', value: 'music' },
        { label: 'Video Entry', value: 'video' },
        { label: 'Photo Contest', value: 'photo' },
        { label: 'Creator Contest', value: 'creator' },
        { label: 'Fan Contest', value: 'fan' },
        { label: 'General Entry', value: 'general' },
      ],
    },

    // TIMING
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },

    // ENTRIES
    {
      name: 'entries',
      type: 'relationship',
      relationTo: 'contest-entries',
      hasMany: true,
    },

    // JUDGES
    {
      name: 'judges',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    // STATUS
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Active', value: 'active' },
        { label: 'Voting', value: 'voting' },
        { label: 'Closed', value: 'closed' },
      ],
    },

    // WINNER
    {
      name: 'winner',
      type: 'relationship',
      relationTo: 'contest-entries',
    },
    SEOFields,
  ],
}
