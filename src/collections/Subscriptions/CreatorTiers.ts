import type { CollectionConfig } from 'payload'

export const CreatorTiers: CollectionConfig = {
  slug: 'creator-tiers',

  admin: {
    useAsTitle: 'name',
    group: 'Creator Economy',
    defaultColumns: ['name', 'creator', 'price', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    { name: 'creator', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'hidden', 'archived'].map((v) => ({ label: v, value: v })),
    },

    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', required: true, admin: { width: '50%' } },
        { name: 'currency', type: 'text', defaultValue: 'USD', admin: { width: '50%' } },
      ],
    },

    {
      name: 'billingInterval',
      type: 'select',
      required: true,
      defaultValue: 'monthly',
      options: ['monthly', 'yearly'].map((v) => ({ label: v, value: v })),
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'benefits',
      type: 'relationship',
      relationTo: 'creator-tier-benefits',
      hasMany: true,
    },

    {
      name: 'mediaPreview',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
