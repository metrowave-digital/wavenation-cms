// src/fields/seo.ts

import type { Field } from 'payload'

export const seoFields: Field = {
  type: 'group',
  name: 'seo',
  label: 'SEO',
  admin: {
    description: 'Search engine, social sharing, and discovery metadata.',
  },
  fields: [
    /* ==========================================================
       CORE SEO METADATA
    ========================================================== */
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Custom SEO title (50–60 characters recommended).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'SEO meta description (140–160 characters recommended).',
      },
    },
    {
      name: 'keywords',
      type: 'text',
      admin: {
        description: 'Comma-separated keywords (used for internal search & legacy SEO).',
      },
    },

    /* ==========================================================
       CANONICAL & INDEX CONTROL
    ========================================================== */
    {
      type: 'row',
      fields: [
        {
          name: 'canonicalUrl',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Canonical URL to prevent duplicate content issues.',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          admin: {
            width: '25%',
            description: 'Prevent search engines from indexing this page.',
          },
        },
        {
          name: 'noFollow',
          type: 'checkbox',
          admin: {
            width: '25%',
            description: 'Prevent search engines from following links on this page.',
          },
        },
      ],
    },

    /* ==========================================================
       OPEN GRAPH (FACEBOOK / LINKEDIN)
    ========================================================== */
    {
      type: 'group',
      name: 'openGraph',
      label: 'Open Graph',
      admin: {
        description: 'Metadata used by Facebook, LinkedIn, and most social platforms.',
      },
      fields: [
        {
          name: 'ogTitle',
          type: 'text',
          admin: {
            description: 'Override Open Graph title (falls back to SEO title).',
          },
        },
        {
          name: 'ogDescription',
          type: 'textarea',
          admin: {
            description: 'Override Open Graph description.',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Social share image (1200×630 recommended).',
          },
        },
        {
          name: 'ogType',
          type: 'select',
          defaultValue: 'website',
          options: [
            { label: 'Website', value: 'website' },
            { label: 'Article', value: 'article' },
            { label: 'Video', value: 'video.other' },
            { label: 'Profile', value: 'profile' },
          ],
        },
      ],
    },

    /* ==========================================================
       TWITTER / X CARD METADATA
    ========================================================== */
    {
      type: 'group',
      name: 'twitter',
      label: 'Twitter / X',
      admin: {
        description: 'Metadata used for Twitter / X cards.',
      },
      fields: [
        {
          name: 'cardType',
          type: 'select',
          defaultValue: 'summary_large_image',
          options: [
            { label: 'Summary', value: 'summary' },
            {
              label: 'Summary Large Image',
              value: 'summary_large_image',
            },
            { label: 'Player', value: 'player' },
          ],
        },
        {
          name: 'twitterTitle',
          type: 'text',
        },
        {
          name: 'twitterDescription',
          type: 'textarea',
        },
        {
          name: 'twitterImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* ==========================================================
       STRUCTURED DATA / AI DISCOVERY
    ========================================================== */
    {
      name: 'structuredData',
      type: 'json',
      admin: {
        description: 'Optional JSON-LD structured data (Schema.org).',
      },
    },

    /* ==========================================================
       PLATFORM & AI CONTROLS
    ========================================================== */
    {
      type: 'group',
      name: 'platformControls',
      label: 'Platform Controls',
      admin: {
        description: 'Controls for internal discovery, AI indexing, and feeds.',
      },
      fields: [
        {
          name: 'excludeFromInternalSearch',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Hide from internal platform search and discovery.',
          },
        },
        {
          name: 'excludeFromRecommendations',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Prevent this item from being used in recommendation engines.',
          },
        },
      ],
    },
  ],
}
