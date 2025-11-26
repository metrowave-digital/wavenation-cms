import type { Field } from 'payload'

export const SEOFields: Field = {
  name: 'seo',
  label: 'SEO & OpenGraph',
  type: 'group',
  admin: {
    description: 'Controls how this content appears on search engines and social media.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      required: false,
      admin: { placeholder: 'Custom page title (optional)' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      admin: { placeholder: 'Short, compelling summary' },
    },
    {
      name: 'openGraphImage',
      type: 'upload',
      label: 'OpenGraph Image',
      relationTo: 'media',
      admin: {
        description: 'Used for social sharing previews',
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical URL (optional)',
    },
    {
      name: 'hideFromSearchEngines',
      type: 'checkbox',
      label: 'Hide from Search Engines (noindex)',
      defaultValue: false,
    },
  ],
}
