import type { CollectionConfig, FieldAccess } from 'payload'
import { hasRoleAtOrAbove, isAdminRole } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS
============================================================ */

const staffOnlyField: FieldAccess = ({ req }: any): boolean =>
  Boolean(req?.user && hasRoleAtOrAbove(req, Roles.STAFF))

/* ============================================================
   COLLECTION
============================================================ */

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',

  admin: {
    useAsTitle: 'sku',
    group: 'Ecommerce',
    defaultColumns: ['sku', 'price', 'inventory'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
  ----------------------------------------------------------- */
  access: {
    /**
     * Public storefront + staff override
     */
    read: () => true,

    /**
     * Controlled catalog
     */
    create: ({ req }) => Boolean(req?.user && hasRoleAtOrAbove(req, Roles.STAFF)),
    update: ({ req }) => Boolean(req?.user && hasRoleAtOrAbove(req, Roles.STAFF)),
    delete: ({ req }) => Boolean(req?.user && isAdminRole(req)),
  },

  fields: [
    /* --------------------------------------------------------
       PRODUCT RELATION
    -------------------------------------------------------- */
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },

    /* --------------------------------------------------------
       IDENTITY
    -------------------------------------------------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
      access: { update: staffOnlyField },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      required: true,
      access: { update: staffOnlyField },
    },

    /* --------------------------------------------------------
       PRICING
    -------------------------------------------------------- */
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      access: { update: staffOnlyField },
    },

    /* --------------------------------------------------------
       MEDIA
    -------------------------------------------------------- */
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    /* --------------------------------------------------------
       OPTIONS (SIZE / COLOR / ETC)
    -------------------------------------------------------- */
    {
      name: 'options',
      type: 'array',
      access: { update: staffOnlyField },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },

    /* --------------------------------------------------------
       INVENTORY (CRITICAL)
    -------------------------------------------------------- */
    {
      name: 'inventory',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Inventory for this specific variant',
      },
      access: { update: staffOnlyField },
    },
  ],
}

export default ProductVariants
