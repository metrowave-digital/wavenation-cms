import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const MediaVariants: CollectionConfig = {
  slug: 'media-variants',

  admin: {
    useAsTitle: 'label',
    group: 'Core',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read (safe for frontend/media usage)
     - Staff can manage variants
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Original media item this variant belongs to.',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Variant label (e.g. thumbnail, square, landscape).',
      },
    },
    {
      name: 'variant',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Generated or uploaded media variant.',
      },
    },
  ],
}

export default MediaVariants
