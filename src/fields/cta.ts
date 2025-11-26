// src/fields/cta.ts
import type { Field } from 'payload'

export const CTAFields: Field = {
  name: 'cta',
  label: 'Call To Action',
  type: 'group',
  admin: {
    description: 'Buttons or links that guide the user to take action.',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Button Label',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Button URL',
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      label: 'Button Style',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'White', value: 'white' },
      ],
      defaultValue: 'primary',
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      label: 'Open in New Tab?',
      defaultValue: false,
    },
  ],
}
