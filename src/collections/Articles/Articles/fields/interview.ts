import { Field } from 'payload'

export const interviewFields: Field[] = [
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

  {
    type: 'relationship',
    name: 'author',
    label: 'Author',
    relationTo: 'profiles',
    required: true,
  },

  {
    type: 'relationship',
    name: 'podcast',
    label: 'Podcast',
    relationTo: 'podcast-episodes',
    required: false,
  },

  {
    type: 'relationship',
    name: 'musicVideo',
    label: 'Music Video',
    relationTo: 'media',
    required: false,
  },

  {
    type: 'relationship',
    name: 'interviewVideo',
    label: 'Interview Video',
    relationTo: 'media',
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
      description: 'Explain who the interview subject is and why they matter.',
    },
  },

  // -----------------------------------------
  // INTERVIEW Q/A BLOCKS
  // -----------------------------------------
  {
    type: 'array',
    name: 'interview',
    label: 'Interview Q&A',
    labels: {
      singular: 'Q&A Entry',
      plural: 'Q&A Entries',
    },
    required: true,
    admin: {
      description: 'Add as many Q&A blocks as needed. Each entry contains a question and answer.',
    },
    fields: [
      {
        type: 'text',
        name: 'question',
        label: 'Question',
        required: true,
      },
      {
        type: 'textarea',
        name: 'answer',
        label: 'Answer',
        required: true,
      },
    ],
  },

  // -----------------------------------------
  // CLOSING NOTES
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'closingNotes',
    label: 'Closing Notes',
    admin: {
      description: 'Final thoughts, upcoming projects, or any closing commentary.',
    },
  },

  // -----------------------------------------
  // SIDEBAR
  // -----------------------------------------
  {
    type: 'group',
    name: 'sidebar',
    label: 'Sidebar',
    fields: [
      // Social Links
      {
        type: 'array',
        name: 'socialLinks',
        label: 'Social Links',
        fields: [
          {
            type: 'text',
            name: 'platform',
            label: 'Platform',
            required: true,
          },
          {
            type: 'text',
            name: 'url',
            label: 'URL',
            required: true,
          },
        ],
      },

      // Tour Dates
      {
        type: 'array',
        name: 'tourDates',
        label: 'Tour Dates',
        fields: [
          {
            type: 'text',
            name: 'date',
            label: 'Tour Date',
          },
        ],
      },

      // Releases
      {
        type: 'array',
        name: 'releases',
        label: 'Releases',
        fields: [
          {
            type: 'text',
            name: 'release',
            label: 'Release',
          },
        ],
      },
    ],
  },

  // -----------------------------------------
  // RELATED ARTISTS
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'relatedArtists',
    label: 'Related Artist(s) (Optional)',
    relationTo: 'profiles',
    hasMany: true,
  },
]
