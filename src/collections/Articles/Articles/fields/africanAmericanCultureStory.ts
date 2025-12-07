import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const africanAmericanCultureStoryFields: Field[] = [
  // ------------------------------------------
  // BASIC METADATA
  // ------------------------------------------
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

  // ------------------------------------------
  // MAIN ARTICLE BODY (Blocks)
  // ------------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Article Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description: 'Build your Hook → Background → Main Story → Voices → Connection using Blocks.',
    },
  },

  // ------------------------------------------
  // LOCAL VOICES (array)
  // ------------------------------------------
  {
    type: 'array',
    name: 'localVoices',
    dbName: 'aa_localvoices', // safe
    label: 'Local Voices',
    labels: {
      singular: 'Voice',
      plural: 'Voices',
    },
    admin: {
      description: 'Quotes or community voices featured in the story.',
    },
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

  // ------------------------------------------
  // RESOURCES (array)
  // ------------------------------------------
  {
    type: 'array',
    name: 'resources',
    dbName: 'aa_resources',
    label: 'Resources',
    labels: {
      singular: 'Resource',
      plural: 'Resources',
    },
    admin: {
      description: 'Optional resources, links, or cultural references.',
    },
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
