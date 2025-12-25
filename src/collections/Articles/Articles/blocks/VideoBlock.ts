import type { Block } from 'payload'

/* -------------------------------------------------
   Local helper type for siblingData narrowing
-------------------------------------------------- */

type VideoBlockData = {
  sourceType?: 'upload' | 'external'
  isSponsored?: boolean
}

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },

  fields: [
    /* ============================================================
       VIDEO SOURCE
    ============================================================ */

    {
      name: 'sourceType',
      type: 'select',
      required: true,
      defaultValue: 'upload',
      options: [
        { label: 'Uploaded Video', value: 'upload' },
        { label: 'External (YouTube / Vimeo)', value: 'external' },
      ],
    },

    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as VideoBlockData
          return data?.sourceType === 'upload'
        },
      },
    },

    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        placeholder: 'https://youtube.com/watch?v=…',
        condition: (_, siblingData: unknown) => {
          const data = siblingData as VideoBlockData
          return data?.sourceType === 'external'
        },
      },
      validate: (
        val: unknown,
        {
          siblingData,
        }: {
          siblingData?: unknown
        },
      ) => {
        const data = siblingData as VideoBlockData

        if (data?.sourceType === 'external' && typeof val !== 'string') {
          return 'External videos require a URL.'
        }

        return true
      },
    },

    /* ============================================================
       PRESENTATION
    ============================================================ */

    {
      name: 'headline',
      type: 'text',
    },

    {
      name: 'caption',
      type: 'textarea',
    },

    {
      name: 'credit',
      type: 'text',
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'altText',
      type: 'text',
    },

    {
      name: 'transcript',
      type: 'textarea',
    },

    {
      name: 'hasCaptions',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ============================================================
       PLAYBACK OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        { name: 'autoplay', type: 'checkbox', defaultValue: false },
        { name: 'loop', type: 'checkbox', defaultValue: false },
        { name: 'muted', type: 'checkbox', defaultValue: false },
      ],
    },

    /* ============================================================
       SPONSORSHIP / COMPLIANCE
    ============================================================ */

    {
      name: 'isSponsored',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'sponsorDisclosure',
      type: 'textarea',
      admin: {
        condition: (_, siblingData: unknown) => {
          const data = siblingData as VideoBlockData
          return data?.isSponsored === true
        },
      },
      validate: (
        val: unknown,
        {
          siblingData,
        }: {
          siblingData?: unknown
        },
      ) => {
        const data = siblingData as VideoBlockData

        if (data?.isSponsored && typeof val !== 'string') {
          return 'Sponsor disclosure is required for sponsored videos.'
        }

        return true
      },
    },

    /* ============================================================
       ANALYTICS / INTERNAL
    ============================================================ */

    {
      name: 'trackingId',
      type: 'text',
    },

    {
      name: 'internalNotes',
      type: 'textarea',
    },
  ],
}
