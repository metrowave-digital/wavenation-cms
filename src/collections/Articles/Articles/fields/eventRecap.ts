import { Field } from 'payload'

export const eventRecapFields: Field[] = [
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
      description: 'Event name, location, date, and audience size/type.',
    },
    required: true,
  },

  // -----------------------------------------
  // HIGHLIGHTS (bullet list)
  // -----------------------------------------
  {
    type: 'text',
    name: 'highlights',
    label: 'Highlights',
    hasMany: true,
    admin: {
      description: 'List key moments from the event.',
    },
  },

  // -----------------------------------------
  // ATMOSPHERE
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'atmosphere',
    label: 'Atmosphere',
    admin: {
      description: 'Describe the energy, visuals, crowd, venue, and overall experience.',
    },
  },

  // -----------------------------------------
  // CULTURAL TAKEAWAYS
  // -----------------------------------------
  {
    type: 'textarea',
    name: 'culturalTakeaways',
    label: 'Cultural Takeaways',
    admin: {
      description: 'Explain why the event resonated with the community or culture.',
    },
  },

  // -----------------------------------------
  // PHOTOS (Image + Alt)
  // -----------------------------------------
  {
    type: 'array',
    name: 'photos',
    label: 'Photos',
    labels: {
      singular: 'Photo',
      plural: 'Photos',
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
    admin: {
      description: 'Upload photos with required alt text for accessibility.',
    },
  },

  // -----------------------------------------
  // RELATED EVENTS (optional)
  // -----------------------------------------
  {
    type: 'relationship',
    name: 'relatedEvents',
    label: 'Related Events (Optional)',
    relationTo: 'events',
    hasMany: true,
  },
]
