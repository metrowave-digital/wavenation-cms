import type { CollectionConfig } from 'payload'

export const Followers: CollectionConfig = {
  slug: 'followers',

  admin: {
    useAsTitle: 'id',
    group: 'Social',
    defaultColumns: ['follower', 'following', 'createdAt'],
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
      name: 'follower',
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
      name: 'notifyOnFollow',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Followed user is notified.' },
    },

    {
      name: 'inboxEntry',
      type: 'relationship',
      relationTo: 'inbox',
      admin: { description: 'Automatically created inbox entry.' },
    },

    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      admin: { description: 'Optional notification record.' },
    },

    // Audit
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
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
        }
        return data
      },
    ],
  },
}
