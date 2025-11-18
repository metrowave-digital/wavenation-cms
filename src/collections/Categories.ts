import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: { useAsTitle: 'name' },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
    { name: 'description', type: 'textarea' },
  ],
}
