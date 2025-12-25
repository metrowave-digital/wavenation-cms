import type { Block } from 'payload'

/* -------------------------------------------------
   Narrowed sibling data type for conditions
-------------------------------------------------- */
type AdsBlockData = {
  adType?: 'banner' | 'native' | 'script'
}

export const AdsBlock: Block = {
  slug: 'adUnit',
  labels: {
    singular: 'Ad / Sponsor',
    plural: 'Ads / Sponsors',
  },

  fields: [
    /* ============================================================
       AD TYPE
    ============================================================ */

    {
      name: 'adType',
      type: 'select',
      required: true,
      options: [
        { label: 'Image Banner', value: 'banner' },
        { label: 'Native Inline Text', value: 'native' },
        { label: 'External Script Embed', value: 'script' },
      ],
      admin: {
        description: 'Select the type of advertising unit.',
      },
    },

    /* ============================================================
       BANNER AD
    ============================================================ */

    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as AdsBlockData
          return data?.adType === 'banner'
        },
        description: 'Banner image for display advertising.',
      },
    },

    {
      name: 'bannerAlt',
      type: 'text',
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as AdsBlockData
          return data?.adType === 'banner'
        },
        description: 'Accessibility text for the banner image.',
      },
    },

    {
      name: 'clickUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as AdsBlockData
          return data?.adType === 'banner'
        },
        placeholder: 'https://…',
        description: 'Destination URL when the banner is clicked.',
      },
    },

    /* ============================================================
       NATIVE AD
    ============================================================ */

    {
      name: 'nativeText',
      type: 'textarea',
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as AdsBlockData
          return data?.adType === 'native'
        },
        description: 'Native advertising copy (clearly marked as sponsored).',
      },
    },

    /* ============================================================
       SCRIPTED AD (HIGH RISK)
    ============================================================ */

    {
      name: 'script',
      type: 'code',
      admin: {
        language: 'javascript',
        condition: (_, siblingData: unknown) => {
          const data = siblingData as AdsBlockData
          return data?.adType === 'script'
        },
        description: '⚠ External ad script. Use only with trusted providers.',
      },
    },

    {
      name: 'sandbox',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as AdsBlockData
          return data?.adType === 'script'
        },
        description: 'Apply iframe sandboxing (strongly recommended).',
      },
    },

    /* ============================================================
       SPONSOR / DISCLOSURE (FTC SAFE)
    ============================================================ */

    {
      name: 'sponsorName',
      type: 'text',
      label: 'Sponsor Name',
      admin: {
        description: 'Name of sponsoring organization or brand.',
      },
    },

    {
      name: 'disclosure',
      type: 'textarea',
      admin: {
        description: 'Required disclosure for sponsored or paid content.',
      },
      validate: (val: unknown, { siblingData }) => {
        const data = siblingData as AdsBlockData

        if ((data?.adType === 'native' || data?.adType === 'script') && typeof val !== 'string') {
          return 'Sponsored ads must include a disclosure.'
        }

        return true
      },
    },

    /* ============================================================
       DISPLAY OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Full Width', value: 'full' },
          ],
        },
        {
          name: 'showLabel',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show “Sponsored” or “Advertisement” label.',
          },
        },
      ],
    },

    /* ============================================================
       ANALYTICS / TRACKING
    ============================================================ */

    {
      name: 'trackingId',
      type: 'text',
      admin: {
        description: 'Optional analytics or campaign tracking ID.',
      },
    },

    /* ============================================================
       INTERNAL SAFETY / AUDIT
    ============================================================ */

    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Staff member who approved this ad unit.',
        readOnly: true,
      },
    },

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial or legal notes (not public).',
      },
    },
  ],
}
