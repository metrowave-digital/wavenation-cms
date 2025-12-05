import { Field } from 'payload'

export const musicReviewFields: Field[] = [
  {
    type: 'text',
    name: 'sub', // subtitle
    label: 'Subtitle',
    required: false,
  },

  {
    type: 'relationship',
    name: 'cat', // category
    label: 'Category',
    relationTo: 'categories',
    required: true,
  },

  {
    type: 'relationship',
    name: 'subcat',
    label: 'Sub-Category',
    relationTo: 'categories',
    required: false,
  },

  {
    type: 'relationship',
    name: 'auth',
    label: 'Author',
    relationTo: 'profiles',
    required: true,
  },

  // -----------------------------------------
  // INTRO
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'intro',
    label: 'Intro',
    admin: {
      description: 'Brief context, release date, and why the project matters.',
    },
  },

  // -----------------------------------------
  // TRACK / ALBUM ANALYSIS (Grouped)
  // -----------------------------------------
  {
    type: 'group',
    name: 'taa', // track-album-analysis
    label: 'Track / Album Analysis',
    fields: [
      {
        type: 'textarea',
        name: 'sp', // sound production
        label: 'Sound & Production',
      },
      {
        type: 'textarea',
        name: 'vp', // vocal performance
        label: 'Vocal Performance',
      },
      {
        type: 'textarea',
        name: 'lt', // lyrics themes
        label: 'Lyrics & Themes',
      },
      {
        type: 'text',
        name: 'st', // standout tracks
        label: 'Standout Tracks',
        hasMany: true,
        admin: {
          description: 'List standout tracks (one per line).',
        },
      },
      {
        type: 'textarea',
        name: 'wp', // weak points
        label: 'Weak Points',
      },
    ],
  },

  // -----------------------------------------
  // CULTURAL POSITIONING
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'cp',
    label: 'Cultural Positioning',
    admin: {
      description: 'How this project fits into genre trends, the scene, or the artist’s evolution.',
    },
  },

  // -----------------------------------------
  // VERDICT
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'vd', // verdict
    label: 'The Verdict',
    admin: {
      description: '1–2 paragraph summary conclusion of the review.',
    },
  },

  // -----------------------------------------
  // RATING (1–10)
  // -----------------------------------------
  {
    type: 'number',
    name: 'rt', // rating
    label: 'Rating (1–10)',
    required: true,
    min: 1,
    max: 10,
    admin: {
      description: 'Use WaveNation’s 1–10 rating scale.',
      width: '33%',
    },
  },

  // -----------------------------------------
  // TRACKLIST
  // -----------------------------------------
  {
    type: 'text',
    name: 'tl', // tracklist
    label: 'Tracklist (Optional)',
    hasMany: true,
    admin: {
      description: 'Add track names in order.',
    },
  },

  // -----------------------------------------
  // Related Tracks
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'rtr', // related tracks
    label: 'Related Tracks (Optional)',
    relationTo: 'tracks',
    hasMany: true,
  },

  // -----------------------------------------
  // Related Albums
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'ral', // related albums
    label: 'Related Albums (Optional)',
    relationTo: 'albums',
    hasMany: true,
  },
]
