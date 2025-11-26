import type { CollectionConfig } from 'payload'
import { normalizeTagNames } from '@/hooks/normalizeTagNames'
import { generateSlug } from '@/hooks/generateSlug'
import { SEOFields } from '@/fields/seo'

export const Tags: CollectionConfig = {
  slug: 'tags',

  admin: {
    useAsTitle: 'name',
    group: 'Taxonomy',
    defaultColumns: ['name', 'type', 'isTrending', 'usageCount'],
  },

  access: {
    read: () => true,
    create: () => true, // allow contributors to add tags
    update: ({ req }) => !!req.user, // logged-in users only
    delete: ({ req }) => req.user?.role === 'admin',
  },

  hooks: {
    beforeChange: [normalizeTagNames, generateSlug],
  },

  fields: [
    /* ----------------------------
     * BASIC INFO
     * ---------------------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        description: 'Auto-generated tag slug.',
      },
    },

    /* ----------------------------
     * TYPE
     * ---------------------------- */
    {
      name: 'type',
      type: 'select',
      defaultValue: 'general',
      admin: {
        description: 'How this tag is used across the platform.',
      },
      options: [
        { label: 'General', value: 'general' },
        { label: 'Music', value: 'music' },
        { label: 'Artist / Creator', value: 'creator' },
        { label: 'Radio', value: 'radio' },
        { label: 'TV / Video', value: 'video' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'News & Editorial', value: 'editorial' },
        { label: 'Event / Festival', value: 'event' },
        { label: 'Lifestyle / Culture', value: 'lifestyle' },
      ],
    },

    /* ----------------------------
     * BRANDING / UI
     * ---------------------------- */
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Optional — use for tag badges/chips in the UI.',
      },
    },

    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Optional — name of Lucide or custom icon.',
      },
    },

    /* ----------------------------
     * STATUS
     * ---------------------------- */
    {
      name: 'isTrending',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },

    /* ----------------------------
     * ANALYTICS
     * ---------------------------- */
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Automatically incremented when tag is used.',
      },
    },

    {
      name: 'lastUsedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },

    /* ----------------------------
     * SEO (optional for tag landing pages)
     * ---------------------------- */
    SEOFields,
  ],
}
