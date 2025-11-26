import type { CollectionConfig } from 'payload'

export const SurveyResponses: CollectionConfig = {
  slug: 'survey-responses',

  labels: {
    singular: 'Survey Response',
    plural: 'Survey Responses',
  },

  admin: {
    group: 'Engagement',
    defaultColumns: ['survey', 'user', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  fields: [
    {
      name: 'survey',
      type: 'relationship',
      relationTo: 'surveys',
      required: true,
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'answers',
      type: 'array',
      fields: [
        { name: 'questionId', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
    },
  ],
}
