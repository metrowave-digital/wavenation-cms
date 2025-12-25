import type { CollectionConfig, Access } from 'payload'
import { isAdmin, isStaffAccess } from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read:
 * - Logged-in users only
 * (Row filtering handled via queries)
 */
const canReadPayouts: Access = ({ req }) => Boolean(req?.user)

/**
 * Create:
 * - Admin / Staff only
 * (Payouts should never be user-created)
 */
const canCreatePayout: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Update:
 * - Admin / Staff only
 * (Status transitions + notes)
 */
const canUpdatePayout: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Delete:
 * - Disabled (financial audit integrity)
 */
const canDeletePayout: Access = () => false

/* ============================================================
   COLLECTION
============================================================ */

export const CreatorPayouts: CollectionConfig = {
  slug: 'creator-payouts',

  admin: {
    useAsTitle: 'payoutReference',
    group: 'Creator Economy',
    defaultColumns: ['creator', 'amount', 'currency', 'status', 'payoutDate'],
  },

  access: {
    read: canReadPayouts,
    create: canCreatePayout,
    update: canUpdatePayout,
    delete: canDeletePayout,
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
       PAYOUT IDENTIFIER
    -------------------------------------------------------- */
    {
      name: 'payoutReference',
      type: 'text',
      unique: true,
      admin: {
        description: 'External payout reference (Stripe, Wise, PayPal, etc.)',
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       AMOUNT
    -------------------------------------------------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
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
       STATUS
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'processing',
      options: [
        { label: 'Processing', value: 'processing' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Reversed', value: 'reversed' },
      ],
      admin: {
        description: 'Lifecycle state of this payout',
      },
    },

    {
      name: 'payoutDate',
      type: 'date',
      admin: {
        description: 'Date funds were sent',
      },
    },

    /* --------------------------------------------------------
       NOTES & AUDIT
    -------------------------------------------------------- */
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal accounting notes (never user-visible)',
      },
    },

    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Provider payloads, batch IDs, reconciliation data',
      },
    },
  ],
}
