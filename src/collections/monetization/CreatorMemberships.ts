import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const CreatorMemberships: CollectionConfig = {
  slug: 'creator-memberships',

  labels: {
    singular: 'Membership Tier',
    plural: 'Membership Tiers',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Monetization',
    defaultColumns: ['name', 'creator', 'price', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: allowRoles(['admin']),
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    /* CREATOR */
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'creator-channels', // <-- MUST match actual collection slug
      required: true,
    },

    /* TIER INFO */
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'textarea' },

    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { description: 'Monthly subscription price in USD.' },
    },

    /* BENEFITS */
    {
      name: 'benefits',
      type: 'array',
      fields: [{ name: 'benefit', type: 'text' }],
    },

    /* ACCESS CONTROL */
    {
      name: 'contentAccess',
      type: 'group',
      fields: [
        { name: 'posts', type: 'checkbox', defaultValue: true },
        { name: 'videos', type: 'checkbox', defaultValue: true },
        { name: 'music', type: 'checkbox', defaultValue: true },
        { name: 'podcasts', type: 'checkbox', defaultValue: true },
      ],
    },

    /* STATUS */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    /* SEO */
    SEOFields,
  ],
}
