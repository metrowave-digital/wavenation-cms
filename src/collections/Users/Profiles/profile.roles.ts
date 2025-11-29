// src/collections/Profiles/profile.roles.ts

import type { Field } from 'payload'

export const profileRoleFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'isHost', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
      { name: 'isCreator', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
      { name: 'isContributor', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
      { name: 'isEditor', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
    ],
  },

  {
    type: 'row',
    fields: [
      {
        name: 'tier',
        type: 'select',
        defaultValue: 'free',
        admin: { width: '50%' },
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Creator', value: 'creator' },
          { label: 'Pro', value: 'pro' },
          { label: 'Industry', value: 'industry' },
        ],
      },
      { name: 'industryTitle', type: 'text', admin: { width: '50%' } },
    ],
  },

  {
    name: 'hostedShows',
    type: 'relationship',
    relationTo: 'shows',
    hasMany: true,
    admin: {
      description: 'Shows this profile hosts.',
      condition: (data: Record<string, any>) => !!data?.isHost, // ✔ typed
    },
  },

  {
    name: 'editorialArticles',
    type: 'relationship',
    relationTo: 'articles',
    hasMany: true,
    admin: {
      description: 'Articles edited by this profile.',
      condition: (data: Record<string, any>) => !!data?.isEditor, // ✔ typed
    },
  },

  {
    name: 'editorialReviews',
    type: 'relationship',
    relationTo: 'reviews',
    hasMany: true,
    admin: {
      description: 'Reviews authored by this profile.',
      condition: (data: Record<string, any>) => !!data?.isEditor, // ✔ typed
    },
  },
]
