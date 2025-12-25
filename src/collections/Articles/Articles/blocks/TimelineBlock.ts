import type { Block } from 'payload'

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },

  fields: [
    /* ============================================================
       TIMELINE META
    ============================================================ */

    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional headline displayed above the timeline.',
      },
    },

    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Optional introduction explaining the context of this timeline.',
      },
    },

    /* ============================================================
       TIMELINE EVENTS
    ============================================================ */

    {
      type: 'array',
      name: 'events',
      label: 'Timeline Events',
      minRows: 1,
      fields: [
        /* ---------------- DATE / TIME ---------------- */

        {
          name: 'year',
          type: 'text',
          required: true,
          admin: {
            width: '25%',
            description: 'Year or date label (e.g., “1968”, “March 2020”, “Summer 1995”).',
          },
        },

        {
          name: 'sortOrder',
          type: 'number',
          admin: {
            description: 'Optional manual ordering override (lower appears first).',
          },
        },

        /* ---------------- CONTENT ---------------- */

        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Short title for this timeline event.',
          },
        },

        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Detailed description of what happened.',
          },
        },

        /* ---------------- MEDIA (OPTIONAL) ---------------- */

        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image or video associated with this event.',
          },
        },

        {
          name: 'mediaCaption',
          type: 'textarea',
          admin: {
            description: 'Caption or credit for the associated media.',
          },
        },

        /* ---------------- CATEGORIZATION ---------------- */

        {
          name: 'category',
          type: 'select',
          admin: {
            description: 'Optional category for filtering or styling.',
          },
          options: [
            { label: 'Historical', value: 'historical' },
            { label: 'Cultural', value: 'cultural' },
            { label: 'Political', value: 'political' },
            { label: 'Music / Arts', value: 'arts' },
            { label: 'Faith / Spiritual', value: 'faith' },
            { label: 'Personal', value: 'personal' },
          ],
        },

        /* ---------------- LINKS ---------------- */

        {
          name: 'relatedLink',
          type: 'text',
          admin: {
            description: 'Optional external or internal URL for further reading.',
            placeholder: 'https://… or /articles/…',
          },
        },

        /* ---------------- ACCESSIBILITY ---------------- */

        {
          name: 'ariaLabel',
          type: 'text',
          admin: {
            description: 'Optional accessibility label for screen readers.',
          },
        },

        /* ---------------- INTERNAL ---------------- */

        {
          name: 'internalNotes',
          type: 'textarea',
          admin: {
            description: 'Internal editorial notes (not shown publicly).',
          },
        },
      ],
    },

    /* ============================================================
       DISPLAY OPTIONS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'vertical',
          options: [
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
          ],
          admin: {
            description: 'Visual layout for the timeline component.',
          },
        },
        {
          name: 'highlightFirst',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Visually emphasize the first timeline event.',
          },
        },
      ],
    },

    /* ============================================================
       INTERNAL METADATA
    ============================================================ */

    {
      name: 'internalId',
      type: 'text',
      admin: {
        description: 'Optional internal identifier for analytics or testing.',
      },
    },
  ],
}
