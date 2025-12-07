import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const filmTVReviewFields: Field[] = [
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
  // MULTI-SECTION REVIEW BODY (replaces intro, plot, analysis, cultural analysis, verdict)
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Review Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, plot summary, creative analysis, cultural themes, verdict, embeds, screenshots, etc.',
    },
  },

  // -----------------------------------------
  // RATING
  // -----------------------------------------
  {
    type: 'number',
    name: 'rating',
    label: 'Rating (1–10)',
    required: true,
    min: 1,
    max: 10,
    admin: {
      width: '33%',
    },
  },

  // -----------------------------------------
  // OPTIONAL RELATIONS
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'relatedShow',
    label: 'Related Show',
    relationTo: 'shows',
    hasMany: true,
  },
  {
    type: 'relationship',
    name: 'relatedFilm',
    label: 'Related Film',
    relationTo: 'films',
    hasMany: true,
  },
]
