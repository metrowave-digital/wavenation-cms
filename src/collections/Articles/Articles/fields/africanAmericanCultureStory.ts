import type { Field } from 'payload'

export const africanAmericanCultureStoryFields: Field[] = [
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
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
  },

  // HOOK
  {
    type: 'textarea',
    name: 'hook',
    label: 'Hook',
    admin: {
      description: 'An evocative moment or detail.',
    },
  },

  // BACKGROUND
  {
    type: 'textarea',
    name: 'background',
    label: 'Background',
  },

  // MAIN STORY
  {
    type: 'textarea',
    name: 'mainStory',
    label: 'Main Story',
  },

  // LOCAL VOICES — ONLY the array field gets dbName
  {
    type: 'array',
    name: 'localVoices',
    dbName: 'aa_localvoices', // ✅ allowed here
    label: 'Local Voices',
    fields: [
      {
        type: 'textarea',
        name: 'quote',
        label: 'Quote',
        required: true,
      },
      {
        type: 'text',
        name: 'speaker',
        label: 'Speaker',
      },
    ],
  },

  // CONNECTION
  {
    type: 'textarea',
    name: 'connectionToWN',
    label: 'Connection to WaveNation Audience',
  },

  // RESOURCES — ONLY the array field gets dbName
  {
    type: 'array',
    name: 'resources',
    dbName: 'aa_resources', // ✅ allowed here
    label: 'Resources',
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Resource Title',
        required: true,
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
      },
    ],
  },
]
