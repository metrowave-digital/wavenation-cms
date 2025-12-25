import type { CollectionConfig, Access } from 'payload'
import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   HELPERS
============================================================ */

const isAddressOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc?.user) return false
  return String(doc.user) === String(req.user.id)
}

/* ============================================================
   ACCESS RULES
============================================================ */

const canReadAddress: Access = (args: any): boolean => {
  const { req, doc } = args
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  return isAddressOwner(req, doc)
}

const canModifyAddress: Access = (args: any): boolean => {
  const { req, doc } = args
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  return isAddressOwner(req, doc)
}

/* ============================================================
   COLLECTION
============================================================ */

export const ShippingAddresses: CollectionConfig = {
  slug: 'shipping-addresses',

  admin: {
    useAsTitle: 'id',
    group: 'Ecommerce',
  },

  access: {
    /**
     * Logged-in users only
     */
    create: ({ req }) => Boolean(req?.user),

    /**
     * Owner + Staff + Admin
     */
    read: canReadAddress,
    update: canModifyAddress,
    delete: canModifyAddress,
  },

  fields: [
    /* --------------------------------------------------------
       OWNER
    -------------------------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      index: true,
    },

    /* --------------------------------------------------------
       ADDRESS
    -------------------------------------------------------- */
    { name: 'fullName', type: 'text', required: true },
    { name: 'line1', type: 'text', required: true },
    { name: 'line2', type: 'text' },
    { name: 'city', type: 'text', required: true },
    { name: 'state', type: 'text' },
    { name: 'postalCode', type: 'text' },
    { name: 'country', type: 'text', required: true },
    { name: 'phone', type: 'text' },
  ],
}

export default ShippingAddresses
