import type { CollectionConfig } from 'payload'
import { ROLE_LIST } from '../access/roles'
import { isAdmin, allowIfSelfOrAdmin } from '../access/control'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // REQUIRED

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'firstName', 'lastName'],
  },

  access: {
    read: isAdmin,
    create: isAdmin,
    update: allowIfSelfOrAdmin,
    delete: isAdmin,
  },

  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'role',
      type: 'select',
      options: ROLE_LIST.map((r) => ({ label: r, value: r })),
      required: true,
      defaultValue: 'contributor',
      admin: { position: 'sidebar' },
    },
  ],
}
