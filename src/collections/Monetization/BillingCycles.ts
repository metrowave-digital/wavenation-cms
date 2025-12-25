import type { CollectionConfig, Access } from 'payload'

import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * READ:
 * - Admin / Staff only
 * Billing cycles are ledger records
 */
const canReadBillingCycle: Access = ({ req }) =>
  Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)))

/**
 * CREATE:
 * - System / Admin only
 */
const canCreateBillingCycle: Access = ({ req }) => Boolean(req?.user && isAdminRole(req))

/**
 * UPDATE:
 * - Admin / Staff only
 */
const canUpdateBillingCycle: Access = ({ req }) =>
  Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)))

/**
 * DELETE:
 * - Admin only (ledger safety)
 */
const canDeleteBillingCycle: Access = ({ req }) => Boolean(req?.user && isAdminRole(req))

/* ============================================================
   COLLECTION
============================================================ */

export const BillingCycles: CollectionConfig = {
  slug: 'billing-cycles',

  admin: {
    group: 'Subscriptions',
    useAsTitle: 'id',
    defaultColumns: ['subscription', 'cycleStart', 'cycleEnd', 'status', 'amount'],
  },

  access: {
    read: canReadBillingCycle,
    create: canCreateBillingCycle,
    update: canUpdateBillingCycle,
    delete: canDeleteBillingCycle,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       SUBSCRIPTION
    -------------------------------------------------------- */
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      required: true,
      access: {
        update: ({ req }) => Boolean(req?.user && isAdminRole(req)),
      },
    },

    /* --------------------------------------------------------
       CYCLE WINDOW
    -------------------------------------------------------- */
    {
      name: 'cycleStart',
      type: 'date',
      required: true,
    },
    {
      name: 'cycleEnd',
      type: 'date',
      required: true,
    },

    /* --------------------------------------------------------
       STATUS
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: ['upcoming', 'active', 'completed'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    /* --------------------------------------------------------
       BILLING
    -------------------------------------------------------- */
    {
      name: 'amount',
      type: 'number',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
    },
    {
      name: 'paidAt',
      type: 'date',
    },
  ],
}

export default BillingCycles
