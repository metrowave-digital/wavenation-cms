// src/collections/Profiles/profile.creator.ts

import type { Field } from 'payload'

export const profileCreatorFields: Field[] = [
  {
    name: 'creatorChannels',
    type: 'relationship',
    relationTo: 'creator-channels',
    hasMany: true,
  },

  {
    name: 'creatorTiers',
    type: 'relationship',
    relationTo: 'creator-tiers',
    hasMany: true,
    admin: { condition: (data) => !!data?.isCreator },
  },

  {
    name: 'creatorSubscriptions',
    type: 'relationship',
    relationTo: 'creator-subscriptions',
    hasMany: true,
  },

  {
    name: 'contentSubscriptions',
    type: 'relationship',
    relationTo: 'content-subscriptions',
    hasMany: true,
  },

  {
    name: 'wavenationPlusStatus',
    type: 'select',
    defaultValue: 'none',
    options: [
      { label: 'No Subscription', value: 'none' },
      { label: 'Active', value: 'active' },
      { label: 'Past Due', value: 'past_due' },
      { label: 'Canceled', value: 'canceled' },
    ],
  },

  {
    name: 'wavenationPlusPlan',
    type: 'relationship',
    relationTo: 'subscription-plans',
  },

  {
    type: 'row',
    fields: [
      { name: 'totalFollowers', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'totalMonthlyListeners', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      { name: 'totalEarnings', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    ],
  },

  {
    name: 'creatorEarnings',
    type: 'relationship',
    relationTo: 'creator-earnings',
    hasMany: true,
    admin: { condition: (data) => !!data?.isCreator },
  },

  {
    name: 'creatorPayouts',
    type: 'relationship',
    relationTo: 'creator-payouts',
    hasMany: true,
    admin: { condition: (data) => !!data?.isCreator },
  },
]
