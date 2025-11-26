// src/collections/ecommerce/Products.ts
import type { CollectionConfig } from 'payload'
import { SEOFields } from '@/fields/seo'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, publicRead } from '@/access/control'

export const Products: CollectionConfig = {
  slug: 'products',

  labels: {
    singular: 'Product',
    plural: 'Products',
  },

  admin: {
    useAsTitle: 'name',
    group: 'E-Commerce',
    defaultColumns: ['name', 'type', 'status', 'priceType'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    /* BASIC INFO */
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true },

    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Digital Product', value: 'digital' },
        { label: 'Live Video Pass', value: 'live-video' },
        { label: 'Subscription Plan', value: 'subscription' },
        { label: 'Ticket / Event', value: 'ticket' },
        { label: 'Physical Product', value: 'physical' },
        { label: 'Bundle', value: 'bundle' },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    { name: 'description', type: 'textarea' },

    /* PRODUCT MEDIA */
    { name: 'coverImage', type: 'upload', relationTo: 'media' },

    /* DIGITAL CONTENT */
    {
      name: 'digitalFile',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data.type === 'digital' },
    },

    /* LIVE VIDEO ACCESS */
    {
      name: 'liveVideo',
      type: 'relationship',
      relationTo: 'live-events',
      admin: { condition: (data) => data.type === 'live-video' },
    },

    /* EVENT TICKET DATA */
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: { condition: (data) => data.type === 'ticket' },
    },

    /* SUBSCRIPTION PLAN LINK */
    {
      name: 'subscriptionPlan',
      type: 'relationship',
      relationTo: 'subscription-plans',
      admin: { condition: (data) => data.type === 'subscription' },
    },

    /* PRICES ASSOCIATED WITH STRIPE PRICE IDs */
    {
      name: 'priceType',
      type: 'select',
      defaultValue: 'one-time',
      options: [
        { label: 'One-Time Purchase', value: 'one-time' },
        { label: 'Recurring (Subscription)', value: 'recurring' },
      ],
    },

    {
      name: 'prices',
      type: 'relationship',
      relationTo: 'prices',
      hasMany: true,
    },

    SEOFields,
  ],
}

export default Products
