// src/collections/Profiles/profile.content.ts

import type { Field } from 'payload'

export const profileContentFields: Field[] = [
  {
    name: 'savedContent',
    type: 'relationship',
    hasMany: true,
    relationTo: ['tracks', 'albums', 'episodes', 'shows', 'podcasts', 'films', 'vod', 'articles'],
  },

  {
    name: 'likedContent',
    type: 'relationship',
    hasMany: true,
    relationTo: [
      'tracks',
      'albums',
      'episodes',
      'shows',
      'podcasts',
      'films',
      'vod',
      'articles',
      'charts',
    ],
  },

  { name: 'followedCharts', type: 'relationship', relationTo: 'charts', hasMany: true },

  { name: 'reviewsAuthored', type: 'relationship', relationTo: 'reviews', hasMany: true },

  { name: 'articlesAuthored', type: 'relationship', relationTo: 'articles', hasMany: true },

  {
    type: 'row',
    fields: [
      { name: 'totalContentLikes', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'totalContentSaves', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'totalComments', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    ],
  },
]
