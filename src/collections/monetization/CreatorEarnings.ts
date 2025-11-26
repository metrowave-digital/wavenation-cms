import type { CollectionConfig, CollectionBeforeValidateHook, TypeWithID } from 'payload'

// ==========================================
// Type Definition (including required Payload fields)
// ==========================================
type ProCreatorEarning = TypeWithID & {
  createdAt?: string
  updatedAt?: string

  title?: string
  creator?: string | number
  payoutPeriodStart?: string
  payoutPeriodEnd?: string

  currency?: string
  grossEarnings?: number
  platformFees?: number
  taxesWithheld?: number
  netPayout?: number

  sourceType?: string
  status?: string
  externalPayoutId?: string
  notes?: string
}

// ==========================================
// Auto-calc net payout
// ==========================================
const calculateNetPayout: CollectionBeforeValidateHook<ProCreatorEarning> = async ({ data }) => {
  if (!data) return data

  const gross = Number(data.grossEarnings ?? 0)
  const fees = Number(data.platformFees ?? 0)
  const taxes = Number(data.taxesWithheld ?? 0)

  // Only calculate if at least one is a valid number
  if (!isNaN(gross) || !isNaN(fees) || !isNaN(taxes)) {
    data.netPayout = Number((gross - fees - taxes).toFixed(2))
  }

  return data
}

// ==========================================
// Collection Config
// ==========================================
export const ProCreatorEarnings: CollectionConfig = {
  slug: 'pro-creator-earnings',

  labels: {
    singular: 'Pro Creator Earning',
    plural: 'Pro Creator Earnings',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'creator', 'netPayout', 'currency', 'status', 'updatedAt'],
    group: 'Creators',
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user && req.user.role === 'admin',
  },

  hooks: {
    beforeValidate: [calculateNetPayout],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "July 2025 – Spotify Payout".',
      },
    },

    // ===============================
    // FIXED RELATIONSHIP
    // ===============================
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
      admin: { position: 'sidebar' },
    },

    // ===============================
    // PAYOUT PERIOD
    // ===============================
    {
      type: 'row',
      fields: [
        {
          name: 'payoutPeriodStart',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'payoutPeriodEnd',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },

    // ===============================
    // EARNINGS INPUTS
    // ===============================
    {
      type: 'row',
      fields: [
        {
          name: 'currency',
          type: 'text',
          required: true,
          defaultValue: 'USD',
          admin: { width: '25%' },
        },
        {
          name: 'grossEarnings',
          type: 'number',
          required: true,
          admin: { width: '25%' },
        },
        {
          name: 'platformFees',
          type: 'number',
          admin: { width: '25%' },
        },
        {
          name: 'taxesWithheld',
          type: 'number',
          admin: { width: '25%' },
        },
      ],
    },

    // ===============================
    // AUTO-CALCULATED
    // ===============================
    {
      name: 'netPayout',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto-calculated: gross - fees - taxes.',
      },
    },

    // ===============================
    // PAYOUT META
    // ===============================
    {
      type: 'row',
      fields: [
        {
          name: 'sourceType',
          type: 'select',
          defaultValue: 'streaming',
          options: [
            { label: 'Streaming', value: 'streaming' },
            { label: 'Tips / Donations', value: 'tips' },
            { label: 'Ads / Sponsorships', value: 'ads' },
            { label: 'Merch / Sales', value: 'merch' },
            { label: 'Other', value: 'other' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Paid', value: 'paid' },
            { label: 'Failed', value: 'failed' },
          ],
          admin: { width: '50%' },
        },
      ],
    },

    // ===============================
    // OPTIONAL
    // ===============================
    {
      name: 'externalPayoutId',
      type: 'text',
      admin: {
        description: 'Payment processor ID (Stripe, PayPal, etc.)',
      },
    },

    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}

export default ProCreatorEarnings
