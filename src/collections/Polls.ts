import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const Polls: CollectionConfig = {
  slug: 'polls',

  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'status', 'showResults', 'expiresAt'],
  },

  versions: { drafts: true },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  fields: [
    /* POLL QUESTION */
    {
      name: 'question',
      type: 'text',
      required: true,
    },

    /* POLL SETTINGS */
    {
      name: 'pollType',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Single Choice', value: 'single' },
        { label: 'Multiple Choice', value: 'multiple' },
      ],
      required: true,
    },

    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If disabled, user must be logged in to vote.',
      },
    },

    {
      name: 'hideResultsUntilEnd',
      type: 'checkbox',
      defaultValue: false,
      label: 'Hide Results Until Poll Ends',
    },

    {
      name: 'showResults',
      type: 'checkbox',
      defaultValue: true,
      label: 'Display Results to Users',
    },

    /* STATUS */
    {
      name: 'poll_status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
    },

    /* EXPIRATION */
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'If set, poll automatically closes when this time is reached.',
      },
    },

    /* ASSOCIATED CONTENT */
    {
      name: 'attachedTo',
      type: 'relationship',
      relationTo: ['articles', 'shows', 'episodes'],
      hasMany: false,
      admin: {
        description: 'Attach poll to an article, radio show, or episode.',
      },
    },

    /* POLL OPTIONS */
    {
      name: 'options',
      type: 'relationship',
      relationTo: 'poll-items',
      hasMany: true,
      required: true,
    },

    /* IP PROTECTION */
    {
      name: 'trackedIPs',
      type: 'array',
      admin: {
        description: 'System-level: Records IPs that have already voted to prevent duplicates.',
      },
      fields: [
        {
          name: 'ip',
          type: 'text',
        },
        {
          name: 'votedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },

    /* METRICS */
    {
      name: 'totalVotes',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
