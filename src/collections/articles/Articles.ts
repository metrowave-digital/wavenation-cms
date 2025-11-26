import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { generateSlug } from '@/hooks/generateSlug'
import { setAuthor } from '@/hooks/setAuthor'
import { SEOFields } from '@/fields/seo'

export const Articles: CollectionConfig = {
  slug: 'articles',

  labels: {
    singular: 'Article',
    plural: 'Articles',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Editorial',
    defaultColumns: [
      'title',
      'editorialStatus',
      'author',
      'isBreaking',
      'publishedAt',
      'algorithm.featuredPriority',
    ],
  },

  versions: { drafts: true },

  access: {
    read: ({ req }) => (!req.user ? { editorialStatus: { equals: 'published' } } : true),

    create: allowRoles(['editor', 'creator', 'contributor', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'admin']),
    delete: allowRoles(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug, setAuthor],
  },

  fields: [
    /* --------------------------------
     * TITLE + SLUG
     * -------------------------------- */
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    /* --------------------------------
     * FULL EDITORIAL WORKFLOW
     * draft → review → fact-check → approved → scheduled → published
     * -------------------------------- */
    {
      name: 'editorialStatus',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Needs Review', value: 'review' },
        { label: 'Fact Checking', value: 'fact-check' },
        { label: 'Approved', value: 'approved' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    /* WORKFLOW ROLES */
    {
      name: 'writer',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Primary writer (auto-filled if using setAuthor).' },
    },

    {
      name: 'editor',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Assigned editor.' },
    },

    {
      name: 'approver',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Final approver before publishing.' },
    },

    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Reviewed By',
    },

    {
      name: 'factChecker',
      type: 'relationship',
      relationTo: 'users',
      label: 'Fact Checker',
    },

    {
      name: 'coAuthors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Collaborating Authors',
    },

    /* --------------------------------
     * PUBLISHING & SCHEDULING
     * -------------------------------- */
    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },

    {
      name: 'publishAt',
      type: 'date',
      label: 'Schedule Publish Time',
      admin: { description: 'Auto-publishes at this date/time.' },
    },

    {
      name: 'unpublishAt',
      type: 'date',
      label: 'Auto-Unpublish Time',
      admin: { description: 'Automatically archives/unpublishes.' },
    },

    /* --------------------------------
     * FLAGS
     * -------------------------------- */
    { name: 'isBreaking', type: 'checkbox', defaultValue: false },
    { name: 'isPinned', type: 'checkbox', defaultValue: false },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },

    /* --------------------------------
     * AUTHOR
     * -------------------------------- */
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Automatically set by setAuthor hook.' },
    },

    /* --------------------------------
     * TAXONOMY
     * -------------------------------- */
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
      admin: {
        description: 'Optional — link to long-form investigative or special coverage series.',
      },
    },

    /* --------------------------------
     * CONTENT
     * -------------------------------- */
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText', required: true },

    /* --------------------------------
     * MEDIA
     * -------------------------------- */
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', type: 'text' },
      ],
    },

    {
      name: 'videoEmbed',
      type: 'text',
      admin: { description: 'YouTube, Vimeo, or embed URL / embed code.' },
    },

    {
      name: 'audioClip',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional — attach a clip for audio stories or radio blog segments.',
      },
    },

    /* --------------------------------
     * CROSS-LINKED CONTENT
     * -------------------------------- */
    {
      name: 'relatedShows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
    },

    {
      name: 'relatedEpisodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },

    {
      name: 'relatedPlaylists',
      type: 'relationship',
      relationTo: 'playlists',
      hasMany: true,
    },

    {
      name: 'relatedPolls',
      type: 'relationship',
      relationTo: 'polls',
      hasMany: true,
    },

    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },

    /* --------------------------------
     * COMMENTS (Threaded)
     * -------------------------------- */
    {
      name: 'comments',
      type: 'array',
      admin: { description: 'Threaded comments with moderation support.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'user', type: 'relationship', relationTo: 'users' },
        { name: 'comment', type: 'textarea', required: true },

        {
          name: 'replies',
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'user', type: 'relationship', relationTo: 'users' },
            { name: 'comment', type: 'textarea' },
            {
              name: 'createdAt',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
            },
          ],
        },

        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
        },

        { name: 'approved', type: 'checkbox', defaultValue: true },
        { name: 'flagged', type: 'checkbox', defaultValue: false },
      ],
    },

    /* --------------------------------
     * ALGORITHM SETTINGS
     * from AlgorithmSettings.ts → articles
     * -------------------------------- */
    {
      name: 'algorithm',
      type: 'group',
      fields: [
        { name: 'readingTimeScore', type: 'number', defaultValue: 0 },
        { name: 'freshnessScore', type: 'number', defaultValue: 0 },
        { name: 'topicMatchScore', type: 'number', defaultValue: 0 },
        { name: 'staffPick', type: 'checkbox', defaultValue: false },
        { name: 'featuredPriority', type: 'number', defaultValue: 0 },
      ],
    },

    /* --------------------------------
     * ANALYTICS
     * -------------------------------- */
    { name: 'viewCount', type: 'number', defaultValue: 0 },
    { name: 'likeCount', type: 'number', defaultValue: 0 },
    { name: 'shareCount', type: 'number', defaultValue: 0 },

    SEOFields,
  ],
}

export default Articles
