// src/collections/ScheduleOverrides.ts
import type { CollectionConfig } from 'payload'
import { allowRoles, publicRead } from '@/access/control'

export const ScheduleOverrides: CollectionConfig = {
  slug: 'schedule-overrides',

  labels: {
    singular: 'Schedule Override',
    plural: 'Schedule Overrides',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Radio & TV',
    defaultColumns: ['title', 'targetChannel', 'reason', 'overrideStart', 'overrideEnd'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['program-director']),
    update: allowRoles(['program-director']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'targetChannel',
      type: 'select',
      required: true,
      options: [
        { label: 'Radio', value: 'radio' },
        { label: 'TV', value: 'tv' },
        { label: 'Both', value: 'both' },
      ],
    },

    {
      name: 'overrideStart',
      label: 'Override Start',
      type: 'date',
      required: true,
    },

    {
      name: 'overrideEnd',
      label: 'Override End',
      type: 'date',
      required: true,
    },

    {
      name: 'replacementContent',
      label: 'Replacement Content',
      type: 'relationship',
      relationTo: ['episodes', 'films', 'events'],
      admin: {
        description: 'What plays instead during this override block.',
      },
    },

    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Breaking News', value: 'breaking-news' },
        { label: 'Holiday Special', value: 'holiday' },
        { label: 'Takeover', value: 'takeover' },
        { label: 'Festival / Event', value: 'festival' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
