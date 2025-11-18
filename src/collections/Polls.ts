// apps/cms/src/collections/Polls.ts

import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'
import { setAuthor } from '../hooks/setAuthor'
import { publishDate } from '../hooks/publishDate'

export const Polls: CollectionConfig = {
  slug: 'polls',

  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'isActive', 'updatedAt'],
  },

  access: {
    read: () => true,

    // creators, contributors, hosts can create
    create: allowAdminsAnd(['creator', 'contributor', 'host-dj']),

    // only editors & admins may update
    update: allowAdminsAnd(['editor']),

    // only admin may delete
    delete: allowAdminsAnd(['admin']),
  },

  hooks: {
    beforeChange: [
      setAuthor, // auto-assign req.user
      publishDate, // sets publishedAt if activating for the first time
    ],
  },

  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description or context for this poll.',
      },
    },

    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      labels: {
        singular: 'Option',
        plural: 'Options',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'votes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Votes are incremented by the frontend API.',
          },
        },
      ],
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Inactive polls will not display on the frontend.',
      },
    },

    // auto filled by setAuthor()
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    // auto-set by publishDate() when made active for the first time
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
