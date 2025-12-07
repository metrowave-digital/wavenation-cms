import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const faithInspirationFields: Field[] = [
  // -----------------------------------------
  // BASIC METADATA
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
  // MAIN BODY — unified editor
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Devotional Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for Scripture, reflection, devotional message, application, prayer, images, quotes, and more.',
    },
  },
]
