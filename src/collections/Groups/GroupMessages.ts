import type { CollectionConfig, Access } from 'payload'

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

const isMessageOwnerOrAdmin: Access = async ({ req, id }) => {
  if (!req.user) return false

  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  const admin = roles.includes('admin') || roles.includes('super-admin')
  if (admin) return true

  if (!id) return false

  const message = await req.payload.findByID({
    collection: 'group-messages',
    id,
  })

  const authorId = typeof message.author === 'string' ? message.author : (message.author as any)?.id

  return authorId === req.user.id
}

export const GroupMessages: CollectionConfig = {
  slug: 'group-messages',

  admin: {
    useAsTitle: 'text',
    group: 'Community',
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: isMessageOwnerOrAdmin,
    delete: isMessageOwnerOrAdmin,
  },

  timestamps: true,

  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'groups',
      required: true,
    },
    {
      name: 'parentMessage',
      type: 'relationship',
      relationTo: 'group-messages',
      admin: { description: 'If this is a reply.' },
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Any image/video attachments.' },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req.user) return data
        if (operation === 'create') data.author = req.user.id
        return data
      },
    ],
  },
}
