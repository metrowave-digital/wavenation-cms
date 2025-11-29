import type { CollectionConfig, Access } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

const isEventOwnerOrAdmin: Access = async ({ req, id }) => {
  if (!req.user) return false

  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  const admin = roles.includes('admin') || roles.includes('super-admin')
  if (admin) return true

  if (!id) return false

  const event = await req.payload.findByID({
    collection: 'group-events',
    id,
  })

  const owner = typeof event.createdBy === 'string' ? event.createdBy : (event.createdBy as any)?.id

  return owner === req.user.id
}

export const GroupEvents: CollectionConfig = {
  slug: 'group-events',
  admin: {
    useAsTitle: 'title',
    group: 'Community',
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: isEventOwnerOrAdmin,
    delete: isEventOwnerOrAdmin,
  },

  timestamps: true,

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },

    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
    },

    {
      type: 'row',
      fields: [
        { name: 'start', type: 'date', required: true, admin: { width: '50%' } },
        { name: 'end', type: 'date', admin: { width: '50%' } },
      ],
    },

    {
      name: 'location',
      type: 'text',
      admin: { description: 'Online URL or physical address' },
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user && operation === 'create') {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}
