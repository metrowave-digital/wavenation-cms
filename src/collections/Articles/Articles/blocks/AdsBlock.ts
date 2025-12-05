import type { Block } from 'payload'

export const AdsBlock: Block = {
  slug: 'adUnit',
  labels: { singular: 'Ad / Sponsor', plural: 'Ads / Sponsors' },
  fields: [
    {
      name: 'adType',
      type: 'select',
      required: true,
      options: [
        { label: 'Image Banner', value: 'banner' },
        { label: 'Native Inline Text', value: 'native' },
        { label: 'External Script Embed', value: 'script' },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.adType === 'banner' },
    },
    {
      name: 'nativeText',
      type: 'textarea',
      admin: { condition: (data) => data?.adType === 'native' },
    },
    {
      name: 'script',
      type: 'code',
      admin: {
        language: 'javascript',
        condition: (data) => data?.adType === 'script',
      },
    },
    {
      name: 'sponsorName',
      type: 'text',
      label: 'Sponsor Name (optional)',
    },
  ],
}
