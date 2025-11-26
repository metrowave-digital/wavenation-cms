import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const Surveys: CollectionConfig = {
  slug: 'surveys',

  labels: {
    singular: 'Survey',
    plural: 'Surveys',
  },

  admin: {
    group: 'Engagement',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'startDate', 'endDate'],
  },

  access: {
    read: () => true,
    create: allowRoles(['admin', 'editor']),
    update: allowRoles(['admin', 'editor']),
    delete: allowRoles(['admin']),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },

    // TIMING
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },

    // QUESTIONS
    {
      name: 'questions',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Short Text', value: 'short-text' },
            { label: 'Long Text', value: 'long-text' },
            { label: 'Multiple Choice', value: 'multiple-choice' },
            { label: 'Rating (1–5)', value: 'rating' },
            { label: 'Yes/No', value: 'yes-no' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          admin: { condition: (data) => data.type === 'multiple-choice' },
          fields: [{ name: 'option', type: 'text' }],
        },
      ],
    },

    // RESPONSES
    {
      name: 'responses',
      type: 'relationship',
      relationTo: 'survey-responses', // <-- FIXED
      hasMany: true,
    },

    // STATUS
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
