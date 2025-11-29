import { Field } from 'payload'

export const seoFields: Field = {
  type: 'group',
  name: 'seo',
  label: 'SEO',
  admin: {
    description: 'Search Engine Optimization & social media metadata.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Custom SEO title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'SEO description (160 chars recommended)',
      },
    },
    {
      name: 'keywords',
      type: 'text',
      admin: {
        description: 'Comma-separated (R&B, Gospel, Radio, TV)',
      },
    },

    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Facebook/Twitter share image (Open Graph)',
      },
    },

    {
      name: 'noIndex',
      type: 'checkbox',
      admin: {
        description: 'Hide this page from search engines',
      },
    },
  ],
}
