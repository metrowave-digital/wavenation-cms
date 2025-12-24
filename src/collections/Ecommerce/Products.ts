import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'
import * as AccessControl from '@/access/control'

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
    group: 'Ecommerce',
    defaultColumns: ['name', 'status', 'price', 'brand'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔓 search-safe
    create: AccessControl.isStaff, // controlled catalog
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ===========================================
           TAB — Product Info
        ============================================ */
        {
          label: 'Product Info',
          fields: [
            { name: 'name', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if left empty.' },
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Active', value: 'active' },
                { label: 'Archived', value: 'archived' },
              ],
            },

            { name: 'brand', type: 'text' },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
              admin: {
                description: 'Product description using Lexical editor.',
              },
            },
          ],
        },

        /* ===========================================
           TAB — Pricing & Inventory
        ============================================ */
        {
          label: 'Pricing & Inventory',
          fields: [
            { name: 'price', type: 'number', required: true },
            { name: 'compareAtPrice', type: 'number' },
            { name: 'sku', type: 'text', unique: true },
            { name: 'barcode', type: 'text' },

            {
              name: 'tracking',
              type: 'group',
              fields: [
                {
                  name: 'inventory',
                  type: 'number',
                  defaultValue: 0,
                },
                {
                  name: 'allowBackorder',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'inventoryPolicy',
                  type: 'select',
                  defaultValue: 'deny',
                  options: [
                    { label: 'Deny Checkout', value: 'deny' },
                    { label: 'Allow Backorder', value: 'allow' },
                  ],
                },
              ],
            },
          ],
        },

        /* ===========================================
           TAB — Variants
        ============================================ */
        {
          label: 'Variants',
          fields: [
            {
              name: 'variants',
              type: 'relationship',
              relationTo: 'product-variants',
              hasMany: true,
            },
          ],
        },

        /* ===========================================
           TAB — Media
        ============================================ */
        {
          label: 'Media',
          fields: [
            {
              name: 'images',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'videoPreview',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },

        /* ===========================================
           TAB — SEO
        ============================================ */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ===========================================
           TAB — System
        ============================================ */
        {
          label: 'System',
          fields: [
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
            {
              name: 'updatedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
          ],
        },
      ],
    },
  ],

  /* -----------------------------------------------------------
     HOOKS — slug + audit
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }

        if (data?.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}

export default Products
