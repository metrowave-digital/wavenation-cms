import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',

  admin: {
    useAsTitle: 'title',
    group: 'Engagement',
    defaultColumns: ['title', 'mediaType', 'rating', 'reviewer', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
     * REVIEW META WITH WEIGHTED RATING + CRITIC RATING
     -------------------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
    },
    {
      name: 'criticRating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Optional critic rating (weighted)' },
    },

    {
      name: 'spoiler',
      type: 'checkbox',
      admin: { description: 'Mark review as containing spoilers' },
    },

    {
      name: 'body',
      type: 'richText',
    },

    {
      name: 'editorNotes',
      type: 'richText',
      admin: {
        description: 'Internal-only editorial notes for moderation.',
      },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'approved',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Flagged', value: 'flagged' },
        { label: 'Removed', value: 'removed' },
      ],
    },

    /* --------------------------------------------------------
     * REVIEWER
     -------------------------------------------------------- */
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    /* --------------------------------------------------------
     * MEDIA BEING REVIEWED
     -------------------------------------------------------- */
    {
      name: 'mediaType',
      type: 'select',
      options: [
        'tracks',
        'albums',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'articles',
      ].map((t) => ({ label: t, value: t })),
      required: true,
    },

    {
      name: 'mediaItem',
      type: 'relationship',
      relationTo: [
        'tracks',
        'albums',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'shows',
        'episodes',
        'articles',
      ],
      required: true,
    },

    /* --------------------------------------------------------
     * REACTIONS + COMMENTS (Threaded)
     -------------------------------------------------------- */
    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'review-reactions',
      hasMany: true,
    },

    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'comments',
      hasMany: true,
    },

    /* --------------------------------------------------------
     * AI TOXICITY
     -------------------------------------------------------- */
    {
      name: 'toxicityScore',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'AI toxicity score (0-1).',
      },
    },

    {
      name: 'isToxic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Automatically flagged if toxicity is high.',
      },
    },

    /* --------------------------------------------------------
     * AUDIT
     -------------------------------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],
}
