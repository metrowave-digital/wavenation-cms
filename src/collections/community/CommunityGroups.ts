import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const CommunityGroups: CollectionConfig = {
  slug: 'community-groups',

  labels: {
    singular: 'Community Group',
    plural: 'Community Groups',
  },

  admin: {
    group: 'Community',
    useAsTitle: 'name',
    defaultColumns: ['name', 'privacy', 'memberCount'],
  },

  access: {
    read: () => true,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: allowRoles(['admin']),
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },

    {
      name: 'privacy',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'admins',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
    },

    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },

    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },

    { name: 'memberCount', type: 'number', defaultValue: 0 },

    SEOFields,
  ],
}

export default CommunityGroups
