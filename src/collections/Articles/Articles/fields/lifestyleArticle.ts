import { Field } from 'payload'

export const lifestyleArticleFields: Field[] = [
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
    required: true,
  },

  {
    type: 'relationship',
    name: 'subCategory',
    label: 'Sub-Category',
    relationTo: 'categories',
  },

  // -----------------------------------------
  // INTRO
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'intro',
    label: 'Intro',
    admin: {
      description: 'Relatable hook + problem or opportunity that frames the lifestyle topic.',
    },
    required: true,
  },

  // -----------------------------------------
  // BODY SECTIONS (grouped)
  // -----------------------------------------
  {
    type: 'group',
    name: 'body',
    label: 'Body Sections',
    fields: [
      {
        type: 'textarea',
        name: 'sectionInsight',
        label: 'Section 1 — Insight',
        admin: {
          description: 'Explain the concept or trend.',
        },
      },
      {
        type: 'textarea',
        name: 'sectionExamples',
        label: 'Section 2 — Examples',
        admin: {
          description: 'Relevant scenarios, people, or situations that illustrate the insight.',
        },
      },
      {
        type: 'textarea',
        name: 'sectionAdvice',
        label: 'Section 3 — Advice or Tips',
        admin: {
          description: 'Actionable suggestions, recommendations, or steps.',
        },
      },
      {
        type: 'textarea',
        name: 'sectionCulturalRelevance',
        label: 'Section 4 — Cultural Relevance',
        admin: {
          description: 'Tie the topic to Southern, urban, or multicultural living.',
        },
      },
    ],
  },

  // -----------------------------------------
  // CALL TO ACTION
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'callToAction',
    label: 'Call To Action',
    admin: {
      description: 'What readers should try, consider, or reflect on.',
    },
  },

  // -----------------------------------------
  // IMAGERY
  // -----------------------------------------
  {
    type: 'array',
    name: 'imagery',
    label: 'Imagery',
    labels: {
      singular: 'Image',
      plural: 'Images',
    },
    admin: {
      description: 'Lifestyle photography rules apply—upload images + alt text.',
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
]
