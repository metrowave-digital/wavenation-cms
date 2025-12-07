import type { Field } from 'payload'
import { articleBlocks } from '../blocks/allBlocks'

export const eventRecapFields: Field[] = [
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
  // HIGHLIGHTS (short bullets)
  // -----------------------------------------
  {
    type: 'text',
    name: 'highlights',
    label: 'Highlights',
    hasMany: true,
    admin: {
      description: 'Key standout moments or performances.',
    },
  },

  // -----------------------------------------
  // MAIN BODY — now entirely block-based
  // -----------------------------------------
  {
    type: 'blocks',
    name: 'content',
    label: 'Event Recap Content',
    required: true,
    blocks: articleBlocks,
    admin: {
      description:
        'Use blocks to build the recap: intro, energy, visuals, cultural moments, atmosphere, etc.',
    },
  },

  // -----------------------------------------
  // PHOTO GALLERY
  // -----------------------------------------
  {
    type: 'array',
    name: 'photos',
    label: 'Photos',
    labels: {
      singular: 'Photo',
      plural: 'Photos',
    },
    admin: {
      description: 'Upload photos with proper alt text.',
    },
    fields: [
      {
        type: 'upload',
        name: 'image',
        label: 'Image',
        relationTo: 'media',
        required: true,
      },
      {
        type: 'text',
        name: 'alt',
        label: 'Alt Text',
        required: true,
      },
    ],
  },

  // -----------------------------------------
  // RELATED EVENTS
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'relatedEvents',
    label: 'Related Events (Optional)',
    relationTo: 'events',
    hasMany: true,
  },
]
