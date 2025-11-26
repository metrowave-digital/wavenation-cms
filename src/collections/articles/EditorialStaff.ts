import type { CollectionConfig } from 'payload'

export const EditorialStaff: CollectionConfig = {
  slug: 'editorial-staff',

  admin: {
    group: 'Editorial',
    useAsTitle: 'name',
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}

export default EditorialStaff
