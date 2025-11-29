import type { CollectionConfig } from 'payload'

export const Following: CollectionConfig = {
  slug: 'following',

  admin: {
    useAsTitle: 'id',
    group: 'Social',
    defaultColumns: ['user', 'following', 'createdAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'following',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'syncWithFollowers',
      type: 'checkbox',
      defaultValue: true,
      admin: { readOnly: true },
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}
