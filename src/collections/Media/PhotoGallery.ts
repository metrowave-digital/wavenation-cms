import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const PhotoGallery: CollectionConfig = {
  slug: 'photo-galleries',

  labels: {
    singular: 'Photo Gallery',
    plural: 'Photo Galleries',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'photos'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read
     - Staff manage galleries
     - Admin can delete
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
      name: 'description',
      type: 'textarea',
    },

    {
      type: 'array',
      name: 'photos',
      label: 'Photos',
      minRows: 1,
      fields: [
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
            description: 'Optional caption for this image.',
          },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: {
            description: 'Credit for this image.',
          },
        },
      ],
    },
  ],
}

export default PhotoGallery
