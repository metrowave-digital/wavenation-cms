import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const featureArticleFields: Field[] = [
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

  {
    type: 'relationship',
    name: 'author',
    relationTo: 'profiles',
    required: true,
  },

  // -----------------------------------------
  // MAIN FEATURE BODY — now block-driven
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Feature Article Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Build the narrative using blocks: lede, story, insights, voices, impact, future.',
    },
  },

  // -----------------------------------------
  // CREDITS & SOURCES
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'creditsSources',
    label: 'Credits & Sources',
  },
]
