import type { Block } from 'payload'

export const FootnotesBlock: Block = {
  slug: 'footnotes',
  labels: {
    singular: 'Footnote',
    plural: 'Footnotes',
  },

  fields: [
    /* ============================================================
       BLOCK META
    ============================================================ */

    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional heading displayed above the footnotes section.',
      },
    },

    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Optional introduction explaining the citations or sources.',
      },
    },

    /* ============================================================
       FOOTNOTES
    ============================================================ */

    {
      type: 'array',
      name: 'notes',
      label: 'Footnotes',
      minRows: 1,
      fields: [
        /* ---------------- IDENTIFIER ---------------- */

        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            width: '20%',
            description: 'Footnote label or number (e.g., 1, 2, A, †).',
          },
        },

        {
          name: 'anchorId',
          type: 'text',
          admin: {
            description: 'Optional anchor ID for in-article linking (e.g., fn-1).',
          },
        },

        /* ---------------- CONTENT ---------------- */

        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The footnote text or explanation.',
          },
        },

        /* ---------------- SOURCE / CITATION ---------------- */

        {
          name: 'source',
          type: 'text',
          admin: {
            description: 'Source name (publication, book, interview, archive).',
          },
        },

        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Optional source URL.',
            placeholder: 'https://…',
          },
        },

        {
          name: 'date',
          type: 'date',
          admin: {
            description: 'Optional publication or reference date.',
          },
        },

        /* ---------------- CLASSIFICATION ---------------- */

        {
          name: 'type',
          type: 'select',
          defaultValue: 'citation',
          options: [
            { label: 'Citation', value: 'citation' },
            { label: 'Source', value: 'source' },
            { label: 'Clarification', value: 'clarification' },
            { label: 'Editorial Note', value: 'editorial' },
            { label: 'Legal Reference', value: 'legal' },
          ],
          admin: {
            description: 'Helps classify the type of footnote.',
          },
        },

        /* ---------------- ACCESSIBILITY ---------------- */

        {
          name: 'ariaLabel',
          type: 'text',
          admin: {
            description: 'Optional screen-reader label for this footnote.',
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
          name: 'displayStyle',
          type: 'select',
          defaultValue: 'list',
          options: [
            { label: 'Numbered List', value: 'list' },
            { label: 'Paragraphs', value: 'paragraphs' },
          ],
          admin: {
            description: 'Controls how footnotes are rendered in the frontend.',
          },
        },
        {
          name: 'showBackLinks',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show “Back to reference” links in footnotes.',
          },
        },
      ],
    },

    /* ============================================================
       INTERNAL (NON-RENDERED)
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
