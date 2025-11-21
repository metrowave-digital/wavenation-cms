import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const PollItems: CollectionConfig = {
  slug: 'poll-items',

  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'voteCount'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
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
