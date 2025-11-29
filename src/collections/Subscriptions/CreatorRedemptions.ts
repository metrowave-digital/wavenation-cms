import type { CollectionConfig } from 'payload'

export const CreatorRedemptions: CollectionConfig = {
  slug: 'creator-redemptions',

  admin: {
    useAsTitle: 'code',
    group: 'Creator Economy',
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    delete: () => false,
  },

  fields: [
    { name: 'code', type: 'text', unique: true, required: true },

    { name: 'creator', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'subscriber', type: 'relationship', relationTo: 'profiles' },
    { name: 'tier', type: 'relationship', relationTo: 'creator-tiers' },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'unredeemed',
      options: ['unredeemed', 'redeemed', 'expired', 'invalid'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    { name: 'expiresAt', type: 'date' },
    { name: 'redeemedAt', type: 'date' },

    { name: 'metadata', type: 'json' },
  ],
}
