// src/collections/Profiles/profile.social.ts

import type { Field } from 'payload'

export const profileSocialFields: Field[] = [
  { name: 'followers', type: 'relationship', relationTo: 'profiles', hasMany: true },
  { name: 'following', type: 'relationship', relationTo: 'profiles', hasMany: true },
  {
    name: 'followingChannels',
    type: 'relationship',
    relationTo: 'creator-channels',
    hasMany: true,
  },

  {
    type: 'row',
    fields: [
      { name: 'blockedUsers', type: 'relationship', relationTo: 'profiles', hasMany: true },
      { name: 'blockedBy', type: 'relationship', relationTo: 'profiles', hasMany: true },
    ],
  },
]
