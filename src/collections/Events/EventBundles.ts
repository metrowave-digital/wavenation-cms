import type { CollectionConfig } from 'payload'

export const EventBundles: CollectionConfig = {
  slug: 'event-bundles',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'status', 'price', 'currency'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('super-admin')),
  },

  timestamps: true,

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated if empty.',
      },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* ---------------- CONTENTS ---------------- */
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Events included in this bundle.',
      },
    },

    {
      name: 'ticketTypes',
      type: 'relationship',
      relationTo: 'ticket-types',
      hasMany: true,
      admin: {
        description: 'Specific ticket tiers included, if applicable.',
      },
    },

    {
      name: 'passes',
      type: 'relationship',
      relationTo: 'event-passes',
      hasMany: true,
      admin: {
        description: 'Pass types associated with this bundle.',
      },
    },

    /* ---------------- PRICING ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: { width: '40%' },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          admin: {
            width: '30%',
            description: "Optional 'full price' for showing discount.",
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'maxQuantity',
          type: 'number',
          admin: { width: '33%' },
        },
        {
          name: 'maxPerOrder',
          type: 'number',
          admin: { width: '33%' },
        },
        {
          name: 'sold',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', readOnly: true },
        },
      ],
    },

    /* ---------------- SALES WINDOW ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'salesStart',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'salesEnd',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    /* ---------------- PROMOTIONS ---------------- */
    {
      name: 'promotions',
      type: 'relationship',
      relationTo: 'event-promotions',
      hasMany: true,
      admin: {
        description: 'Promo codes that apply to this bundle.',
      },
    },

    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ---------------- AUDIT ---------------- */
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
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        return data
      },
    ],
  },
}
