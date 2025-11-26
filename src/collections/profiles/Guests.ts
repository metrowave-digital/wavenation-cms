// src/collections/Guests.ts
import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'

export const Guests: CollectionConfig = {
  slug: 'guests',

  admin: {
    useAsTitle: 'name',
    group: 'People',
    defaultColumns: ['name', 'role', 'category', 'featuredOn'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'role', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Artist', value: 'artist' },
        { label: 'Actor', value: 'actor' },
        { label: 'Influencer', value: 'influencer' },
        { label: 'Author', value: 'author' },
        { label: 'Expert / Thought Leader', value: 'expert' },
        { label: 'Community Leader', value: 'community' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'bio',
      type: 'richText',
      required: true,
    },

    {
      name: 'representative',
      type: 'group',
      admin: { description: 'Publicist or booking contact.' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'company', type: 'text' },
      ],
    },

    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },

    {
      name: 'appearanceStatus',
      type: 'select',
      defaultValue: 'potential',
      options: [
        { label: 'Potential', value: 'potential' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    {
      name: 'featuredOn',
      type: 'relationship',
      relationTo: ['shows', 'episodes', 'events'],
      hasMany: true,
    },

    {
      name: 'highlightClips',
      type: 'relationship',
      relationTo: ['vod', 'media'],
      hasMany: true,
      admin: { description: 'Clips or videos featuring this guest.' },
    },

    {
      name: 'preInterviewNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for hosts before recording or live segments.',
      },
    },
  ],
}

export default Guests
