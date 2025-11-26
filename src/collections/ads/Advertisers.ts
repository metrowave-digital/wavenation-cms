import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const Advertisers: CollectionConfig = {
  slug: 'advertisers',

  labels: {
    singular: 'Advertiser',
    plural: 'Advertisers',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Advertising',
    defaultColumns: ['name', 'industry', 'status'],
  },

  access: {
    read: () => true,
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  fields: [
    // BASIC INFO
    { name: 'name', type: 'text', required: true },
    { name: 'industry', type: 'text' },
    { name: 'website', type: 'text' },

    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },

    // CONTACT INFO
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'person', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },

    // CAMPAIGNS
    {
      name: 'campaigns',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'platforms',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Radio', value: 'radio' },
            { label: 'TV', value: 'tv' },
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Podcast', value: 'podcast' },
            { label: 'Creators', value: 'creators' },
          ],
        },
        {
          name: 'creative',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'Click-through landing page' },
        },
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date', required: true },
        { name: 'budget', type: 'number' },
      ],
    },

    // STATUS
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Ended', value: 'ended' },
      ],
    },
  ],
}
