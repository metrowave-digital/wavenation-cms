import { Field } from 'payload'

export const breakingNewsFields: Field[] = [
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    required: false,
  },

  {
    type: 'text',
    name: 'tags',
    label: 'Tags',
    hasMany: true,
    required: false,
  },

  {
    type: 'relationship',
    name: 'category',
    label: 'Category',
    relationTo: 'categories',
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
    required: false,
  },

  // -----------------------------------------
  // WHAT HAPPENED — summary
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'whatHappened',
    label: 'What Happened (2–3 sentence summary)',
    required: true,
    admin: {
      description: 'Concise breaking news summary. Keep under 2–3 sentences.',
    },
  },

  // -----------------------------------------
  // CONFIRMED DETAILS
  // -----------------------------------------
  {
    type: 'text',
    name: 'confirmedDetails',
    label: 'Confirmed Details',
    required: false,
    hasMany: true,
    admin: {
      description: 'Each entry should be a single confirmed fact.',
    },
  },

  // -----------------------------------------
  // WHAT IS NOT YET CONFIRMED
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'notYetConfirmed',
    label: 'What Is NOT Yet Confirmed',
    admin: {
      description:
        'Prevent misinformation. Only list items that need clarification or are pending verification.',
    },
  },

  // -----------------------------------------
  // OFFICIAL STATEMENTS ONLY
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'statements',
    label: 'Statements (official only)',
    admin: {
      description:
        'Include official statements from law enforcement, government, PR teams, companies, etc.',
    },
  },

  // -----------------------------------------
  // CONTEXT
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'context',
    label: 'Context / Background',
    admin: {
      description: 'Explain related history or events.',
    },
  },

  // -----------------------------------------
  // UPDATES — live breaking updates
  // -----------------------------------------
  {
    type: 'text',
    name: 'updates',
    label: 'Live Updates',
    hasMany: true,
    admin: {
      description: 'Add updates as the story evolves.',
    },
  },

  // -----------------------------------------
  // SOCIAL COPY
  // -----------------------------------------
  {
    type: 'text',
    name: 'socialCopyTwitter',
    label: 'Social Copy — Twitter/X',
    admin: {
      description: 'Short, breaking-style update.',
    },
  },
  {
    type: 'textarea',
    name: 'socialCopyInstagram',
    label: 'Social Copy — Instagram Caption',
  },
]
