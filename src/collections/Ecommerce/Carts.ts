import type { CollectionConfig, Access } from 'payload'
import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   HELPERS
============================================================ */

const isCartOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc?.user) return false
  return String(doc.user) === String(req.user.id)
}

/* ============================================================
   ACCESS RULES
   NOTE: args typed as `any` to support `doc`
============================================================ */

const canReadCart: Access = (args: any): boolean => {
  const { req, doc } = args
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  return isCartOwner(req, doc)
}

const canModifyCart: Access = (args: any): boolean => {
  const { req, doc } = args
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  return isCartOwner(req, doc)
}

/* ============================================================
   COLLECTION
============================================================ */

export const Carts: CollectionConfig = {
  slug: 'carts',

  admin: {
    group: 'Ecommerce',
    useAsTitle: 'id',
  },

  access: {
    create: () => true, // guest carts allowed
    read: canReadCart,
    update: canModifyCart,
    delete: canModifyCart,
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: false,
      index: true,
    },

    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'variant',
          type: 'relationship',
          relationTo: 'product-variants',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
      ],
    },

    {
      name: 'subtotal',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'discounts',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'total',
      type: 'number',
      admin: { readOnly: true },
    },
  ],
}
