import { Field } from 'payload'

export const faithInspirationFields: Field[] = [
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
  // OPENING REFLECTION
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'openingReflection',
    label: 'Opening Reflection',
    admin: {
      description: 'Scripture, meditation prompt, or initial reflective thought. (Optional)',
    },
  },

  // -----------------------------------------
  // MESSAGE
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'message',
    label: 'Message',
    required: true,
    admin: {
      description: 'Encouragement, devotional insight, or spiritual lesson.',
    },
  },

  // -----------------------------------------
  // APPLICATION
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'application',
    label: 'Application',
    admin: {
      description: 'Explain how this connects to everyday life and practice.',
    },
  },

  // -----------------------------------------
  // CLOSING PRAYER OR AFFIRMATION
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'closingPrayerOrAffirmation',
    label: 'Closing Prayer or Affirmation',
    admin: {
      description: '(Optional)',
    },
  },
]
