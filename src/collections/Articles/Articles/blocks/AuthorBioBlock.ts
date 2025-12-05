import type { Block } from 'payload'

export const AuthorBioBlock: Block = {
  slug: 'authorBio',
  labels: { singular: 'Author Bio', plural: 'Author Bios' },
  fields: [
    {
      type: 'relationship',
      name: 'author',
      relationTo: 'profiles',
      required: true,
    },
    {
      type: 'textarea',
      name: 'bio',
      label: 'Short Bio Override (Optional)',
    },
    {
      type: 'upload',
      name: 'photo',
      relationTo: 'media',
      label: 'Author Photo',
    },
  ],
}
