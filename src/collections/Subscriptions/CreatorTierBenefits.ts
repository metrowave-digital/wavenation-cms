import type { CollectionConfig } from 'payload'

export const CreatorTierBenefits: CollectionConfig = {
  slug: 'creator-tier-benefits',

  admin: {
    useAsTitle: 'title',
    group: 'Creator Economy',
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },

    {
      name: 'badgeIcon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional—badge shown in chats/comments.' },
    },
  ],
}
