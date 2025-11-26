// src/collections/HomepageArticlesFeed.ts
import type { CollectionConfig } from 'payload'

export const HomepageArticlesFeed: CollectionConfig = {
  slug: 'homepage-articles-feed',

  admin: {
    useAsTitle: 'title',
    group: 'Site Settings',
  },

  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Homepage — Articles & Updates',
      admin: { readOnly: true },
    },

    {
      name: 'heroArticle',
      type: 'relationship',
      relationTo: 'articles',
      admin: {
        description: 'Main headline story at the top of the homepage.',
      },
    },

    {
      name: 'sections',
      type: 'array',
      label: 'Homepage Sections',
      fields: [
        { name: 'title', type: 'text', required: true },

        {
          name: 'items',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
        },

        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}
