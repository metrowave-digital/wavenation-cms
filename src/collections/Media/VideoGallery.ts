import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const VideoGallery: CollectionConfig = {
  slug: 'video-galleries',

  labels: {
    singular: 'Video Gallery',
    plural: 'Video Galleries',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'videos'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read (frontend safe)
     - Staff manage galleries
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
      name: 'description',
      type: 'textarea',
    },

    {
      type: 'array',
      name: 'videos',
      label: 'Videos',
      minRows: 1,
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: {
            description: 'Optional caption for this video.',
          },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: {
            description: 'Credit for this video.',
          },
        },
      ],
    },
  ],
}

export default VideoGallery
