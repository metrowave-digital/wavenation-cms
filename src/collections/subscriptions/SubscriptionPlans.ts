import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles } from '@/access/control'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',

  labels: {
    singular: 'Subscription Plan',
    plural: 'Subscription Plans',
  },

  admin: {
    group: 'Monetization',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'billingInterval',
      'price',
      'isActive',
      'activeSubscribers',
      'stripePriceId',
    ],
    description:
      'Controls all subscription offerings for WaveNation (Monthly, Annual, Premium Access).',
  },

  access: {
    read: () => true,
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* ----------------------------------------------------
     * BASIC INFO
     * --------------------------------------------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used for URLs, API lookups, and internal routing.',
      },
    },

    {
      name: 'description',
      type: 'textarea',
      admin: { placeholder: 'Describe the benefits of this subscription...' },
    },

    /* ----------------------------------------------------
     * PRICING
     * --------------------------------------------------- */
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price IN CENTS. $9.99 = 999',
      },
    },

    {
      name: 'billingInterval',
      type: 'select',
      required: true,
      defaultValue: 'month',
      options: [
        { label: 'Monthly', value: 'month' },
        { label: 'Yearly', value: 'year' },
        { label: 'Quarterly', value: 'quarter' },
        { label: 'Weekly', value: 'week' },
      ],
    },

    {
      name: 'trialPeriodDays',
      type: 'number',
      admin: {
        description: 'Optional free trial length (Stripe Trial Period)',
      },
    },

    /* ----------------------------------------------------
     * PAYMENT PROVIDERS (MULTI-VENDOR SUPPORT)
     * --------------------------------------------------- */
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { description: 'Stripe Product ID (prod_xxx)' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { description: 'Stripe Price ID (price_xxx)' },
    },

    {
      name: 'paddlePriceId',
      type: 'text',
      admin: { description: '(Optional) Paddle Price ID' },
    },

    {
      name: 'lemonSqueezyPriceId',
      type: 'text',
      admin: { description: '(Optional) LemonSqueezy Variant ID' },
    },

    /* ----------------------------------------------------
     * FEATURES & BENEFITS
     * --------------------------------------------------- */
    {
      name: 'features',
      type: 'array',
      label: 'Included Features',
      required: false,
      fields: [{ name: 'text', type: 'text' }],
    },

    {
      name: 'entitlements',
      type: 'relationship',
      relationTo: 'entitlements',
      hasMany: true,
      admin: { description: 'Entitlements granted upon subscription activation.' },
    },

    /* ----------------------------------------------------
     * STATUS
     * --------------------------------------------------- */
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Disable to remove from purchase options.' },
    },

    /* ----------------------------------------------------
     * ANALYTICS (AUTO UPDATED BY WEBHOOK)
     * --------------------------------------------------- */
    {
      name: 'activeSubscribers',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Auto-updated by Stripe Webhooks',
        readOnly: true,
      },
    },

    {
      name: 'lastSynced',
      type: 'date',
      admin: {
        description: 'Timestamp of last webhook sync',
        readOnly: true,
      },
    },
  ],
}

export default SubscriptionPlans
