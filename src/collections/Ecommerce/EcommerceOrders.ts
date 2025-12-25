import type { CollectionConfig, Access } from 'payload'
import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   HELPERS
============================================================ */

const isOrderOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc?.customer) return false
  return String(doc.customer) === String(req.user.id)
}

/* ============================================================
   ACCESS RULES
============================================================ */

const canReadOrder: Access = (args: any): boolean => {
  const { req, doc } = args
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  return isOrderOwner(req, doc)
}

const canUpdateOrder: Access = ({ req }) => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)
}

/* ============================================================
   COLLECTION
============================================================ */

export const EcommerceOrders: CollectionConfig = {
  slug: 'ecommerce-orders',

  admin: {
    useAsTitle: 'orderNumber',
    group: 'Ecommerce',
    defaultColumns: ['orderNumber', 'status', 'total', 'customer'],
  },

  access: {
    /**
     * Orders are created by checkout flow only
     */
    create: () => true,

    /**
     * Secure read access
     */
    read: canReadOrder,

    /**
     * Staff + Admin only (status updates, fulfillment)
     */
    update: canUpdateOrder,

    /**
     * Orders are immutable
     */
    delete: () => false,
  },

  fields: [
    /* --------------------------------------------------------
       IDENTIFIERS
    -------------------------------------------------------- */
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: { readOnly: true },
    },

    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      index: true,
      admin: { readOnly: true },
    },

    /* --------------------------------------------------------
       STATUS
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    /* --------------------------------------------------------
       LINE ITEMS (SNAPSHOT)
    -------------------------------------------------------- */
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: { readOnly: true },
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
        { name: 'quantity', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'total', type: 'number', required: true },
      ],
    },

    /* --------------------------------------------------------
       FINANCIAL TOTALS (LOCKED)
    -------------------------------------------------------- */
    { name: 'subtotal', type: 'number', admin: { readOnly: true } },
    { name: 'shipping', type: 'number', admin: { readOnly: true } },
    { name: 'tax', type: 'number', admin: { readOnly: true } },
    { name: 'discount', type: 'number', admin: { readOnly: true } },
    { name: 'total', type: 'number', admin: { readOnly: true } },

    /* --------------------------------------------------------
       REFERENCES
    -------------------------------------------------------- */
    {
      name: 'shippingAddress',
      type: 'relationship',
      relationTo: 'shipping-addresses',
      admin: { readOnly: true },
    },
    {
      name: 'paymentRecord',
      type: 'relationship',
      relationTo: 'payment-records',
      admin: { readOnly: true },
    },
  ],
}
