import { Field } from 'payload'

export const featureArticleFields: Field[] = [
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

  // -----------------------------------------
  // NARRATIVE LEDE
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'narrativeLede',
    label: 'Narrative Lede',
    admin: {
      description: 'A vivid opening scene or story that pulls the reader in.',
    },
    required: true,
  },

  // -----------------------------------------
  // SECTION 1 — THE STORY
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'sectionStory',
    label: 'Section 1 — The Story',
    admin: {
      description: 'Human-focused narrative detail.',
    },
  },

  // -----------------------------------------
  // SECTION 2 — INSIGHT
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'sectionInsight',
    label: 'Section 2 — Insight',
    admin: {
      description: 'Industry context or cultural analysis.',
    },
  },

  // -----------------------------------------
  // SECTION 3 — VOICES
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'sectionVoices',
    label: 'Section 3 — Voices',
    admin: {
      description: 'Quotes from interviews or experts.',
    },
  },

  // -----------------------------------------
  // SECTION 4 — IMPACT
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'sectionImpact',
    label: 'Section 4 — Impact',
    admin: {
      description: 'Explain the significance of the story.',
    },
  },

  // -----------------------------------------
  // SECTION 5 — FUTURE
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'sectionFuture',
    label: 'Section 5 — Future',
    admin: {
      description: 'What comes next for the subject?',
    },
  },

  // -----------------------------------------
  // CREDITS & SOURCES
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'creditsSources',
    label: 'Credits & Sources',
    admin: {
      description: 'List all references used in this feature.',
    },
  },
]
