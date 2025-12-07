import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const musicReviewFields: Field[] = [
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

  {
    type: 'relationship',
    name: 'author',
    relationTo: 'profiles',
    required: true,
  },

  // -----------------------------------------
  // MAIN REVIEW BODY — block editor
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Review Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks for intro, production analysis, vocal notes, lyrical themes, cultural positioning, verdict, embeds, images, and more.',
    },
  },

  // -----------------------------------------
  // RATING
  // -----------------------------------------
  {
    type: 'number',
    name: 'rating',
    label: 'Rating (1–10)',
    min: 1,
    max: 10,
    required: true,
    admin: { width: '33%' },
  },

  // -----------------------------------------
  // TRACKLIST + RELATED MUSIC
  // -----------------------------------------
  {
    type: 'text',
    name: 'tracklist',
    label: 'Tracklist (Optional)',
    hasMany: true,
  },

  {
    type: 'relationship',
    name: 'relatedTracks',
    label: 'Related Tracks (Optional)',
    relationTo: 'tracks',
    hasMany: true,
  },

  {
    type: 'relationship',
    name: 'relatedAlbums',
    label: 'Related Albums (Optional)',
    relationTo: 'albums',
    hasMany: true,
  },
]
