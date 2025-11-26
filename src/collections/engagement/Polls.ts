import type { CollectionConfig } from 'payload'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'

export const Polls: CollectionConfig = {
  slug: 'polls',

  labels: {
    singular: 'Poll',
    plural: 'Polls',
  },

  admin: {
    group: 'Engagement',
    useAsTitle: 'question',
    defaultColumns: ['question', 'status', 'totalVotes', 'algorithm.featuredPriority'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: isAdmin,
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    /* QUESTION */
    { name: 'question', type: 'text', required: true },

    { name: 'slug', type: 'text', unique: true },

    /* ANSWERS */
    {
      name: 'options',
      type: 'array',
      required: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'votes', type: 'number', defaultValue: 0 },
      ],
    },

    /* META VOTES */
    {
      name: 'totalVotes',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },

    /* STATUS */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
    },

    /* SCHEDULING */
    {
      name: 'availableFrom',
      type: 'date',
    },
    {
      name: 'availableUntil',
      type: 'date',
    },

    /* ATTACHMENTS */
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },
    {
      name: 'relatedShows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
    },
    {
      name: 'relatedEpisodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },

    /* ALGORITHM */
    {
      name: 'algorithm',
      type: 'group',
      fields: [
        { name: 'engagementScore', type: 'number', defaultValue: 0 },
        { name: 'freshnessScore', type: 'number', defaultValue: 0 },
        { name: 'staffPick', type: 'checkbox', defaultValue: false },
        { name: 'featuredPriority', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}

export default Polls
