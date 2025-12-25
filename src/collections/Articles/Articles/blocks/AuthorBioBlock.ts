import type { Block } from 'payload'

export const AuthorBioBlock: Block = {
  slug: 'authorBio',
  labels: {
    singular: 'Author Bio',
    plural: 'Author Bios',
  },

  fields: [
    /* ============================================================
       AUTHOR RELATIONSHIP
    ============================================================ */

    {
      name: 'author',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        description: 'Select the author profile to display.',
      },
    },

    /* ============================================================
       BIO CONTENT
    ============================================================ */

    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Bio Override (Optional)',
      admin: {
        description: 'Optional short bio override. If empty, the profile bio will be used.',
      },
    },

    /* ============================================================
       AUTHOR PHOTO
    ============================================================ */

    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Author Photo',
      admin: {
        description: 'Optional photo override. Falls back to profile image if empty.',
      },
    },

    {
      name: 'photoAlt',
      type: 'text',
      admin: {
        description: 'Accessibility text for the author photo.',
      },
    },

    /* ============================================================
       AUTHOR DETAILS
    ============================================================ */

    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Optional title or role (e.g., Senior Editor, Cultural Correspondent).',
          },
        },
        {
          name: 'organization',
          type: 'text',
          admin: {
            description: 'Optional organization or affiliation.',
          },
        },
      ],
    },

    /* ============================================================
       SOCIAL / LINKS
    ============================================================ */

    {
      type: 'array',
      name: 'socialLinks',
      label: 'Social Links',
      admin: {
        description: 'Optional social or external links for the author.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Website', value: 'website' },
            { label: 'X / Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'https://…',
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
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Compact', value: 'compact' },
            { label: 'Expanded', value: 'expanded' },
          ],
          admin: {
            description: 'Controls visual layout of the author bio.',
          },
        },
        {
          name: 'showDivider',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show a divider above the author bio.',
          },
        },
      ],
    },

    /* ============================================================
       ACCESSIBILITY
    ============================================================ */

    {
      name: 'ariaLabel',
      type: 'text',
      admin: {
        description: 'Optional screen-reader label for the author bio block.',
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
