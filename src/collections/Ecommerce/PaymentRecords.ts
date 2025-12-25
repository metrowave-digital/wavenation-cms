import type { CollectionConfig, Access, FieldAccess } from 'payload'
import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS RULES
============================================================ */

/**
 * Read: Staff + Admin only
 */
const canReadPayment: Access = ({ req }) => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)
}

/**
 * Create: Server / webhook only
 * (never from browser clients)
 */
const canCreatePayment: Access = ({ req }) => {
  if (!req) return false

  // Allow trusted server contexts (webhooks, backend jobs)
  if (!req.user) return true

  // Explicit admin override (manual reconciliation)
  return isAdminRole(req)
}

/**
 * Payments are immutable
 */
const denyMutation: Access = () => false

/* ============================================================
   FIELD ACCESS
============================================================ */

const adminOnlyField: FieldAccess = ({ req }: any) => Boolean(req?.user && isAdminRole(req))

/* ============================================================
   COLLECTION
============================================================ */

export const PaymentRecords: CollectionConfig = {
  slug: 'payment-records',

  admin: {
    useAsTitle: 'id',
    group: 'Ecommerce',
    defaultColumns: ['provider', 'status', 'amount', 'currency'],
  },

  access: {
    read: canReadPayment,
    create: canCreatePayment,
    update: denyMutation,
    delete: denyMutation,
  },

  fields: [
    /* --------------------------------------------------------
       PROVIDER
    -------------------------------------------------------- */
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: ['stripe', 'paypal', 'cashapp', 'manual'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    {
      name: 'providerId',
      type: 'text',
      index: true,
      admin: { readOnly: true },
    },

    /* --------------------------------------------------------
       STATUS
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },

    /* --------------------------------------------------------
       AMOUNTS
    -------------------------------------------------------- */
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      admin: { readOnly: true },
    },

    /* --------------------------------------------------------
       RAW GATEWAY PAYLOAD (ADMIN ONLY)
    -------------------------------------------------------- */
    {
      name: 'raw',
      type: 'json',
      access: {
        read: adminOnlyField,
      },
      admin: {
        description: 'Raw payment gateway payload (admin only).',
      },
    },
  ],
}
