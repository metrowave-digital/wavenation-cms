import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const standardArticleFields: Field[] = [
  /* ===============================
     BASIC METADATA
  ================================ */
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

  /* ===============================
     HERO IMAGE (STANDARD TEMPLATE)
  ================================ */
  {
    type: 'upload',
    name: 'standardHeroImage',
    label: 'Hero Image (Standard)',
    relationTo: 'media',
    required: true,
  },

  {
    type: 'text',
    name: 'standardHeroImageAlt',
    label: 'Hero Image Alt Text',
    required: true,
  },

  /* ===============================
     ARTICLE BODY
  ================================ */
  {
    type: 'blocks',
    name: 'content',
    label: 'Article Body',
    required: true,
    blocks: articleBlocks,
  },

  /* ===============================
     CONTEXT MODULE (OPTIONAL)
  ================================ */
  {
    type: 'group',
    name: 'contextModule',
    label: 'Context Module',
    fields: [
      {
        type: 'select',
        name: 'type',
        label: 'Context Type',
        options: [
          { label: 'What You Need to Know (News)', value: 'news' },
          { label: 'Why This Matters (Culture)', value: 'culture' },
          { label: 'Review Breakdown', value: 'review' },
        ],
      },
      {
        type: 'array',
        name: 'items',
        label: 'Context Items',
        fields: [{ type: 'text', name: 'text', label: 'Item' }],
      },
    ],
  },

  /* ===============================
     CREDITS & SOURCES
  ================================ */
  {
    type: 'textarea',
    name: 'creditsSources',
    label: 'Credits & Sources',
  },
]
