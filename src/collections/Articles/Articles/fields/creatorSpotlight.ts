import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const creatorSpotlightFields: Field[] = [
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
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
  },

  {
    type: 'relationship',
    name: 'tags',
    label: 'Tags',
    relationTo: 'tags',
    hasMany: true,
  },

  // ------------------------------------------
  // BODY — FULL BLOCKS EDITOR
  // ------------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Feature Body (Intro → Origin → Work → Vision)',
    required: true,
    blocks: articleBlocks,
    admin: {
      description: 'Use blocks to construct each section of the Spotlight.',
    },
  },

  // ------------------------------------------
  // MEDIA ASSETS
  // ------------------------------------------
  {
    type: 'array',
    name: 'mediaAssets',
    dbName: 'cs_media',
    label: 'Videos & Photos',
    fields: [
      {
        type: 'select',
        name: 'type',
        label: 'Media Type',
        options: [
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
        ],
        required: true,
      },
      {
        type: 'upload',
        name: 'file',
        label: 'Upload File',
        relationTo: 'media',
      },
      {
        type: 'text',
        name: 'caption',
        label: 'Caption',
      },
      {
        type: 'text',
        name: 'credit',
        label: 'Credit',
      },
    ],
  },
]
