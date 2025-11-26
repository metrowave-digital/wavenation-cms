// src/collections/ads/AdSponsors.ts
import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const AdSponsors: CollectionConfig = {
  slug: 'ads-sponsors',

  labels: {
    singular: 'Ad / Sponsor',
    plural: 'Ads / Sponsors',
  },

  admin: {
    useAsTitle: 'sponsorName',
    group: 'Monetization',
    defaultColumns: ['sponsorName', 'placement', 'isActive', 'activeFrom', 'activeTo'],
  },

  access: {
    read: () => true,
    create: allowRoles(['sales', 'admin']),
    update: allowRoles(['sales', 'admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    {
      name: 'sponsorName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'placement',
      type: 'select',
      required: true,
      options: [
        { label: 'Radio Spot', value: 'radio-spot' },
        { label: 'TV Pre-roll', value: 'tv-preroll' },
        { label: 'TV Mid-roll', value: 'tv-midroll' },
        { label: 'Web Banner', value: 'web-banner' },
        { label: 'Podcast / On-Demand', value: 'podcast' },
        { label: 'Social / Branded Segment', value: 'social' },
      ],
    },
    {
      name: 'targetCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'activeFrom',
      type: 'date',
    },
    {
      name: 'activeTo',
      type: 'date',
    },
    {
      name: 'cpmRate',
      type: 'number',
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
