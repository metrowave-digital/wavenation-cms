// src/collections/Profiles/profile.system.ts

import type { Field } from 'payload'
import { seoFields } from '../../../fields/seo'

export const profileSystemFields: Field[] = [
  {
    name: 'user',
    type: 'relationship',
    relationTo: 'users',
  },

  {
    name: 'groups',
    type: 'relationship',
    relationTo: 'groups',
    hasMany: true,
  },

  {
    label: 'SEO',
    type: 'group',
    fields: [seoFields], // ✅ FIXED — wrap in array
  },

  {
    type: 'row',
    fields: [
      {
        name: 'createdBy',
        type: 'relationship',
        relationTo: 'users',
        admin: { readOnly: true },
      },
      {
        name: 'updatedBy',
        type: 'relationship',
        relationTo: 'users',
        admin: { readOnly: true },
      },
    ],
  },

  {
    name: 'internalNotes',
    type: 'textarea',
  },
]
