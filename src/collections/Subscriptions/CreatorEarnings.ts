import type { CollectionConfig, Access } from 'payload'
import { isAdmin, isStaffAccess } from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read:
 * - Logged-in users only
 * (Row filtering via queries)
 */
const canReadEarnings: Access = ({ req }) => Boolean(req?.user)

/**
 * Create:
 * - System / Admin / Staff only
 * (Earnings are system-generated, never user-created)
 */
const canCreateEarnings: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Update:
 * - Admin / Staff only
 * (Corrections, fee reconciliation, payout linking)
 */
const canUpdateEarnings: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Delete:
 * - Disabled (ledger integrity)
 */
const canDeleteEarnings: Access = () => false

/* ============================================================
   COLLECTION
============================================================ */

export const CreatorEarnings: CollectionConfig = {
  slug: 'creator-earnings',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Economy',
    defaultColumns: ['creator', 'month', 'gross', 'net', 'payoutStatus'],
  },

  access: {
    read: canReadEarnings,
    create: canCreateEarnings,
    update: canUpdateEarnings,
    delete: canDeleteEarnings,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CREATOR
    -------------------------------------------------------- */
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       PERIOD
    -------------------------------------------------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'month',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'Ledger month (YYYY-MM)',
            readOnly: true,
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
          admin: {
            width: '50%',
            readOnly: true,
          },
        },
      ],
    },

    /* --------------------------------------------------------
       REVENUE TOTALS
    -------------------------------------------------------- */
    {
      name: 'gross',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total gross revenue before fees',
      },
    },

    {
      name: 'platformFee',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'WaveNation platform fee',
      },
    },

    {
      name: 'processingFee',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Payment processor fees',
      },
    },

    {
      name: 'net',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Net earnings after fees',
      },
    },

    /* --------------------------------------------------------
       PAYOUT STATE
    -------------------------------------------------------- */
    {
      name: 'payoutStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Held', value: 'held' },
      ],
      admin: {
        description: 'Whether this earnings period has been paid out',
      },
    },

    {
      name: 'payout',
      type: 'relationship',
      relationTo: 'creator-payouts',
      admin: {
        description: 'Linked payout record (if paid)',
      },
    },

    /* --------------------------------------------------------
       METADATA / AUDIT
    -------------------------------------------------------- */
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Aggregation details, source events, reconciliation data',
      },
    },
  ],
}
