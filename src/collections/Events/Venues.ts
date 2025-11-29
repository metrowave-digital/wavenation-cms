import type { CollectionConfig } from 'payload'

export const Venues: CollectionConfig = {
  slug: 'venues',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'city', 'capacity'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Auto-generated if empty.' },
    },
    {
      name: 'venueType',
      type: 'select',
      defaultValue: 'venue',
      options: [
        { label: 'Venue', value: 'venue' },
        { label: 'Theater / Cinema', value: 'theater' },
        { label: 'Club', value: 'club' },
        { label: 'Church', value: 'church' },
        { label: 'Outdoor', value: 'outdoor' },
        { label: 'Virtual', value: 'virtual' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      type: 'row',
      fields: [
        { name: 'capacity', type: 'number', admin: { width: '50%' } },
        { name: 'timezone', type: 'text', admin: { width: '50%' } },
      ],
    },

    {
      name: 'addressLine1',
      type: 'text',
    },
    {
      name: 'addressLine2',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', admin: { width: '40%' } },
        { name: 'state', type: 'text', admin: { width: '30%' } },
        { name: 'postalCode', type: 'text', admin: { width: '30%' } },
      ],
    },
    {
      name: 'country',
      type: 'text',
    },

    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number', admin: { width: '50%' } },
        { name: 'longitude', type: 'number', admin: { width: '50%' } },
      ],
    },

    {
      name: 'contactEmail',
      type: 'text',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },

    {
      name: 'notes',
      type: 'textarea',
    },

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

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}
