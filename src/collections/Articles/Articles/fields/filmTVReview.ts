import { Field } from 'payload'

export const filmTVReviewFields: Field[] = [
  {
    type: 'text',
    name: 'subtitle',
    label: 'Subtitle',
    required: false,
  },

  {
    type: 'relationship',
    name: 'category',
    label: 'Category',
    relationTo: 'categories',
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
    required: false,
  },

  // -----------------------------------------
  // INTRO
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'intro',
    label: 'Intro',
    admin: {
      description: 'Setup, creators, platform, release date, and why the project matters.',
    },
  },

  // -----------------------------------------
  // PLOT SUMMARY
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'plotSummary',
    label: 'Plot Summary (Spoiler Controlled)',
    admin: {
      description: 'Write a clear plot overview without major spoilers unless noted.',
    },
  },

  // -----------------------------------------
  // ANALYSIS (Grouped)
  // -----------------------------------------
  {
    type: 'group',
    name: 'analysis',
    label: 'Analysis',
    fields: [
      {
        type: 'textarea',
        name: 'direction',
        label: 'Direction',
      },
      {
        type: 'textarea',
        name: 'acting',
        label: 'Acting',
      },
      {
        type: 'textarea',
        name: 'cinematography',
        label: 'Cinematography',
      },
      {
        type: 'textarea',
        name: 'writing',
        label: 'Writing',
      },
      {
        type: 'textarea',
        name: 'themes',
        label: 'Themes',
      },
    ],
    admin: {
      description: 'Break down key creative elements of the film/show.',
    },
  },

  // -----------------------------------------
  // CULTURAL ANALYSIS
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'culturalAnalysis',
    label: 'Cultural Analysis',
    admin: {
      description: 'Discuss relevance to Black, Southern, multicultural, or urban audiences.',
    },
  },

  // -----------------------------------------
  // VERDICT
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'verdict',
    label: 'Verdict',
    admin: {
      description: '1–2 paragraph conclusion.',
    },
  },

  // -----------------------------------------
  // RATING (1–10)
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
      description: 'Use WaveNation’s 1–10 rating scale.',
    },
  },

  // -----------------------------------------
  // OPTIONAL RELATIONSHIPS
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'relatedShow',
    label: 'Related Show (Optional)',
    relationTo: 'media',
    hasMany: true,
  },
  {
    type: 'relationship',
    name: 'relatedFilm',
    label: 'Related Film (Optional)',
    relationTo: 'media',
    hasMany: true,
  },
]
