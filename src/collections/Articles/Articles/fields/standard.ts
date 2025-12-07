import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const standardArticleFields: Field[] = [
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
    relationTo: 'categories',
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    relationTo: 'categories',
  },

  {
    type: 'relationship',
    name: 'tags',
    relationTo: 'tags',
    hasMany: true,
  },

  // ------------------------------------------
  // HERO IMAGE
  // ------------------------------------------
  {
    type: 'upload',
    name: 'heroImage',
    relationTo: 'media',
    required: true,
  },

  {
    type: 'text',
    name: 'heroImageAlt',
    required: true,
  },

  // ------------------------------------------
  // MAIN ARTICLE CONTENT (Blocks)
  // ------------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Article Body',
    required: true,
    blocks: articleBlocks,
  },

  // ------------------------------------------
  // CREDITS & SOURCES
  // ------------------------------------------
  {
    type: 'textarea',
    name: 'creditsSources',
    label: 'Credits & Sources',
  },
]
