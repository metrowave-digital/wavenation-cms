// src/fields/socialShare.ts
import type { Field } from 'payload'

export const SocialShareFields: Field = {
  name: 'socialShare',
  label: 'Social Sharing Options',
  type: 'group',
  admin: {
    description: 'Customize how this content is shared on social platforms.',
  },
  fields: [
    {
      name: 'customShareTitle',
      type: 'text',
      label: 'Custom Share Title',
    },
    {
      name: 'customShareDescription',
      type: 'textarea',
      label: 'Custom Share Description',
    },
    {
      name: 'shareImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom Share Image',
      admin: {
        description: 'Overrides OpenGraph image for social sharing.',
      },
    },
    {
      name: 'enableShareLinks',
      type: 'checkbox',
      label: 'Enable Share Buttons',
      defaultValue: true,
    },
  ],
}
