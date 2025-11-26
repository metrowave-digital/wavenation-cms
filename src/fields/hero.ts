// src/fields/hero.ts
import type { Field } from 'payload'

export const HeroFields: Field = {
  name: 'hero',
  label: 'Hero Section',
  type: 'group',
  admin: {
    description: 'Large hero banner for pages, shows, VOD, or articles.',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      label: 'Hero Style',
      options: [
        { label: 'Background Image', value: 'image' },
        { label: 'Video Background', value: 'video' },
        { label: 'Gradient Color', value: 'gradient' },
        { label: 'Minimal / No Media', value: 'minimal' },
      ],
      defaultValue: 'image',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Hero Title',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        condition: (_, siblingData) => siblingData.style === 'image',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Video',
      admin: {
        condition: (_, siblingData) => siblingData.style === 'video',
      },
    },
    {
      name: 'gradient',
      type: 'text',
      label: 'Gradient CSS',
      admin: {
        condition: (_, siblingData) => siblingData.style === 'gradient',
        placeholder: 'e.g. linear-gradient(90deg, #000, #ff1a1a)',
      },
    },
  ],
}
