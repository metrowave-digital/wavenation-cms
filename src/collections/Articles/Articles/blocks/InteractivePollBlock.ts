import type { Block } from 'payload'

export const InteractivePollBlock: Block = {
  slug: 'interactivePoll',
  labels: {
    singular: 'Interactive Poll',
    plural: 'Interactive Polls',
  },

  fields: [
    /* ============================================================
       POLL RELATIONSHIP
    ============================================================ */

    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
      admin: {
        description: 'Select an existing poll to embed inside this article.',
      },
    },

    /* ============================================================
       DISPLAY OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'showResultsInline',
          type: 'checkbox',
          label: 'Show Results Inside Article',
          defaultValue: true,
          admin: {
            description: 'Display poll results immediately after voting.',
          },
        },
        {
          name: 'allowVoteChange',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow users to change their vote after submission.',
          },
        },
      ],
    },

    /* ============================================================
       CONTEXT / EDITORIAL
    ============================================================ */

    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional headline displayed above the poll.',
      },
    },

    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional context explaining why this poll is being asked.',
      },
    },

    /* ============================================================
       ACCESS / VISIBILITY
    ============================================================ */

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Logged-in Users Only', value: 'authenticated' },
        { label: 'WaveNation+ Members', value: 'plus' },
      ],
      admin: {
        description: 'Control who can see and vote in this poll.',
      },
    },

    /* ============================================================
       ANALYTICS / TRACKING
    ============================================================ */

    {
      name: 'trackingId',
      type: 'text',
      admin: {
        description: 'Optional analytics identifier for engagement tracking.',
      },
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional screen-reader label for the poll.',
      },
    },

    /* ============================================================
       INTERNAL (NON-RENDERED)
    ============================================================ */

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal editorial notes (not shown publicly).',
      },
    },
  ],
}
