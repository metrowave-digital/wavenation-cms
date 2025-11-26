// src/fields/imageOptions.ts
import type { Field } from 'payload'

export const ImageOptions: Field = {
  name: 'imageOptions',
  label: 'Image Options',
  type: 'group',
  admin: {
    description: 'Controls how images behave and render across the site.',
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text (Accessibility)',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'focalPoint',
      type: 'select',
      label: 'Focal Point',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'display',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'cover',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
      ],
    },
  ],
}
