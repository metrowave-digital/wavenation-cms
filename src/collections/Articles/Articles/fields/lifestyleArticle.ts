import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const lifestyleArticleFields: Field[] = [
  // -----------------------------------------
  // METADATA
  // -----------------------------------------
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
  },

  {
    type: 'relationship',
    name: 'category',
    relationTo: 'categories',
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    relationTo: 'categories',
  },

  // -----------------------------------------
  // MAIN BODY — full block editor
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Lifestyle Article Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, insights, examples, tips, cultural context, and lifestyle imagery.',
    },
  },

  // -----------------------------------------
  // IMAGERY (keeps its array)
  // -----------------------------------------
  {
    type: 'array',
    name: 'imagery',
    label: 'Imagery',
    labels: { singular: 'Image', plural: 'Images' },
    admin: {
      description: 'Upload lifestyle images with alt text.',
    },
    fields: [
      {
        type: 'upload',
        name: 'image',
        relationTo: 'media',
        required: true,
      },
      {
        type: 'text',
        name: 'alt',
        required: true,
      },
    ],
  },
]
