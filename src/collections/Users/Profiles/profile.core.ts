// src/collections/Profiles/profile.core.ts

import type { Field } from 'payload'

export const profileCoreFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'firstName', type: 'text', admin: { width: '33%' } },
      { name: 'middleInitial', type: 'text', admin: { width: '10%' } },
      { name: 'lastName', type: 'text', admin: { width: '33%' } },
      {
        name: 'displayName',
        type: 'text',
        required: true,
        admin: {
          width: '24%',
          description: 'Public display name on WaveNation.',
        },
      },
    ],
  },

  {
    type: 'row',
    fields: [
      {
        name: 'handle',
        type: 'text',
        unique: true,
        index: true,
        admin: { width: '50%', description: '@handle for profiles and creator channels.' },
      },
      {
        name: 'slug',
        type: 'text',
        unique: true,
        index: true,
        admin: { width: '50%', description: 'Auto-generated if empty.' },
      },
    ],
  },

  {
    type: 'row',
    fields: [
      { name: 'avatar', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
      { name: 'banner', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
    ],
  },

  { name: 'bio', type: 'textarea' },

  {
    type: 'row',
    fields: [
      { name: 'city', type: 'text', admin: { width: '33%' } },
      { name: 'state', type: 'text', admin: { width: '33%' } },
      { name: 'country', type: 'text', admin: { width: '33%' } },
    ],
  },

  { name: 'timeZone', type: 'text', admin: { description: 'Optional preferred time zone.' } },

  {
    type: 'row',
    fields: [
      { name: 'website', type: 'text', admin: { width: '50%' } },
      { name: 'instagram', type: 'text', admin: { width: '50%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'twitter', type: 'text', admin: { width: '50%' } },
      { name: 'tiktok', type: 'text', admin: { width: '50%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'youtube', type: 'text', admin: { width: '50%' } },
      { name: 'facebook', type: 'text', admin: { width: '50%' } },
    ],
  },

  {
    name: 'primaryRole',
    type: 'select',
    defaultValue: 'listener',
    options: [
      { label: 'Listener', value: 'listener' },
      { label: 'Artist', value: 'artist' },
      { label: 'Host / DJ', value: 'host' },
      { label: 'Creator', value: 'creator' },
      { label: 'Industry / Exec', value: 'industry' },
      { label: 'Editor / Critic', value: 'editor' },
    ],
  },
]
