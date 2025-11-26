import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin, publicRead } from '@/access/control'

export const PollItems: CollectionConfig = {
  slug: 'poll-items',

  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'voteCount'],
  },

  access: {
    read: publicRead,

    // editors + admins can create
    create: allowRoles(['editor', 'admin']),

    // editors + admins can update
    update: allowRoles(['editor', 'admin']),

    // only admin can delete
    delete: isAdmin,
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional graphic or thumbnail for the poll option.',
      },
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'weight',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Optional weighting system (useful for contests or weighted votes).',
      },
    },

    {
      name: 'voteCount',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
