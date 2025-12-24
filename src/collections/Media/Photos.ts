import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Photos: CollectionConfig = {
  slug: 'photos',

  labels: {
    singular: 'Photo',
    plural: 'Photos',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'image'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read (frontend safe)
     - Staff manage photos
     - Admin delete only
  ----------------------------------------------------------- */
  access: {
    read: () => true,
    create: AccessControl.isStaff,
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption displayed with the photo.',
      },
    },
    {
      name: 'attribution',
      type: 'text',
      admin: {
        description: 'Photographer or copyright holder (optional).',
      },
    },
  ],
}

export default Photos
